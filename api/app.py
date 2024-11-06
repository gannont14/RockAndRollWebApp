from docToTxt import extract_songs_by_units
from files import generateJson
import time
import sys
from flask import Flask, request, redirect, url_for, jsonify
import docx
from fuzzywuzzy import fuzz, process
import re
import os
import json
from urllib.parse import urlparse
from flask_cors import CORS

sys.path.append('../../')


app = Flask(__name__)
CORS(app)


if __name__ == '__main__':
    app.run(port=8080, debug=True)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/files/<folder_id>')
def get_files(folder_id):
    # folder_id = '10cDnyq58TROnXFVmW5Xt-f2Cj-tjT4Qe'

    try:
        driveFolderResponse = generateJson(folder_id)
    except:
        return {'result': 'failure'}

    return driveFolderResponse


"""
todo: update to take in form object to fill data isntead of disgusting endpoint
        update classes.json when adding to the file
"""


@app.route('/upload/class', methods=['POST'])
def upload_class():
    print("Endpoint hit")
    try:
        print("attempting to upload class")
        # get the name of the class
        class_name = request.form.get('className')
        if not class_name:
            return jsonify({'error': 'Class name is required'}), 500

        print(f"class_name: {class_name}")

        links = request.form.getlist('links')

        number_of_units = len(request.form.getlist('links'))
        print(type(request.form.getlist('links')))

        print(f"number_of_units : {number_of_units}")

        print(f"links: {links}")
        print(f"links[0]: {links[0]}")

        if not links:
            return jsonify({'error': 'links required'}), 500

        print(f"links: {links}")

        file = request.files.get('file')
        if not file or file.filename == '':
            return jsonify({'error': 'file upload failed'}), 500

        print(f"uploading class with \nclass_name:{class_name}\nnumber_of_units: {number_of_units}\nlinks: {links}")

        # pass the classname, number of units, links, and file into function call

        # check first if the links are the actual IDs or the share link
        parsed_folder_ids = []

        for link in links:
            parsed_link = urlparse(link)
            print(f"Original link: {link}")
            link = parsed_link.path.split('/')[-1]
            parsed_folder_ids.append(link)
            print(f"Parsed Link: {link}")

        print(f"Links after parsing : {parsed_folder_ids}")

        # now call the upload file for each of the units, pass in the folderid
        for i in range(number_of_units):
            print(f"loop with : {parsed_folder_ids[i], i + 1, file, class_name}")
            # for each of the units, call upload file, set the output file location to the folder of the className
            upload_file(parsed_folder_ids[i], i + 1, file, class_name)

        # at the end, add it to the classes.json file, append to the class.json file in public folder
        update_classes_json(class_name, number_of_units)

        return jsonify({'success': 'successfullly uploaded class'}), 200

    except Exception as e:
        return jsonify({'error': f'error uploading class, error: {e}'}), 500


def update_classes_json(class_name, number_of_units):
    print(f"Printing to classes.json new name, {class_name}")
    class_json_path = os.path.join(os.path.dirname(__file__), '../public/classes.json')
    # save_path = os.path.join(os.path.dirname(__file__), '../public/classes.json', output_path)
    print(f"new path: {class_json_path}")
    try:
        if os.path.exists(class_json_path):
            with open(class_json_path, 'r') as file:
                classes = json.load(file)
        else:
            classes = []

        class_found = False
        for cls in classes:
            if cls['class_name'] == class_name:
                cls['number_of_units'] = number_of_units
                class_found = True
                break

        # class doesn't exist, update it
        if not class_found:
            classes.append({
                'class_name': class_name,
                'number_of_units': number_of_units
            })

        # updated classes, write back to the file
        with open(class_json_path, 'w') as file:
            json.dump(classes, file, indent=4)
        print(f"updated classes.json with {class_name}")

    except Exception as e:
        print(f"error updating classes.json, e: {e}")
        raise


def upload_file(folder_id, unit_number, file, className):
    print(f"Calling upload_file with: folder_id: {folder_id}, unit_number: {unit_number}, className: {className}")
    try:
        driveFolderResponse = generateJson(folder_id)
    except Exception as e:
        return {'result': f'failure to generate JSON: {str(e)}'}, 500
    # Now the initial json has been uploaded, as wlel as the docx file that can be used to generate the json

    # Extract the songs metadata, and then check to match with fuzzy matching
    try:
        # might change ..................
        print(f'before document extraction')
        doc = docx.Document(file)
        print(f'after document extraction')

        extracted_songs = extract_songs_by_units(doc)
        print(f'songs extraced successfully')

        unit_header = f"UNIT {unit_number}"
        if unit_header not in extracted_songs:
            return jsonify({'error': f'Unit {unit_number} not found in the document provided'})

        unit_songs = extracted_songs[unit_header]
        print(f'unit_songs: {unit_songs}')

        print(f'before parse_songs_from_unit')
        parsed_songs = parse_songs_from_unit(unit_songs)
        print(f'after parse_songs_from_unit: parsed songs: {parsed_songs}')

        print(f'before update_json_with_songs_fuzzy')
        updated_json = update_json_with_songs_fuzzy(driveFolderResponse, parsed_songs)
        print(f'after update_json_with_songs_fuzzy')

        output_path = f'unit{unit_number}.json'
        print(f'set output_path to : {output_path}')

        print(f"New Class Name: {className}")
        class_directory_path = os.path.join(os.path.dirname(__file__), f'../public/classes/{className}')
        print(f"class_directory_path: {class_directory_path}")

        if not os.path.exists(class_directory_path):
            print("Path does not exist")
            os.makedirs(class_directory_path)

        save_path = os.path.join(class_directory_path, output_path)

        directory = os.path.dirname(save_path)
        os.makedirs(directory, exist_ok=True)

        save_json_to_public_folder(updated_json, save_path)

    except Exception as e:
        return jsonify({'error': f'Failed to extract songs: {str(e)}'}), 500

    return jsonify(updated_json), 500


def save_json_to_public_folder(json_data, save_path):
    try:
        with open(save_path, 'w') as json_file:
            json.dump(json_data, json_file, indent=4)
        print(f"JSON saved to: {save_path}")
    except Exception as e:
        print(f"Failed to save JSON to {save_path}: {e}")
        raise e

# THIS IS FOR THE SONG YEAR FORMAT
# def parse_songs_from_unit(unit_songs):
#
#     songs_data = {}
#     current_genre = None
#
#     for line in unit_songs:
#
#         if line.startswith("Genre:"):
#             current_genre = line.replace("Genre:", "").strip()
#         else:
#             #regex to match the 1. Artist Name    Song name (Year)
#             match = re.match(r'^(\d+)\.\s*(.*?)\s{2,}(.*)\s\(\d{4}\)', line)
#             if match:
#                 song_number, artist, song_name = match.groups()
#                 songs_data[song_name.strip()] = {
#                     'song_number': song_number,
#                     'artist': artist.strip(),
#                     'genre': current_genre
#                 }
#
#     return songs_data


# Detect lines with multiple tabs (indicating artist and song separation)
tab_pattern = re.compile(r'\t{2,}')  # Look for at least two consecutive tabs


def parse_songs_from_unit(unit_songs):
    songs_data = {}
    current_genre = None

    for line in unit_songs:
        # Detect and update the current genre
        if line.startswith("Genre:"):
            current_genre = line.replace("Genre:", "").strip()

        else:
            # Match lines with multiple tabs (artist and song separated by tabs)
            match = tab_pattern.split(line)
            if len(match) == 2:  # Expecting two parts: artist and song
                song_number, artist, song_name = match[0].split('.')[0], match[0].split('.')[1], match[1]
                songs_data[song_name.strip()] = {
                    'song_number': song_number.strip(),
                    'artist': artist.strip(),
                    'genre': current_genre
                }

    return songs_data


def update_json_with_songs_fuzzy(json_data, songs_data):
    print(f'json data passed into fuzzy function: {songs_data}')
    for song in json_data:
        song_name = song.get("name")

        # Use fuzzy matching to find the closest match in songs_data
        best_match, score = process.extractOne(song_name, songs_data.keys(), scorer=fuzz.token_sort_ratio)

        if score > 50:  # Adjust threshold based on your needs
            # Get the corresponding artist and genre from the best match
            song['author'] = songs_data[best_match]['artist']
            song['genre'] = songs_data[best_match]['genre']
        else:
            print(f"No good match found for: {song_name} (Best match: {best_match}, Score: {score})")

    print(f'returning update_json_with_songs_fuzzy')
    return json_data


# def extract_songs_by_units(docx_file):
