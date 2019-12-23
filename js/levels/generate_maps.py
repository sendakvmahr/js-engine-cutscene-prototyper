import os
import xml.etree.ElementTree as ET

CURRENT = os.getcwd()
LEVELS_DIR = CURRENT + "/maps"
ASSETS_DIR = CURRENT + "/tilesets/"

def readfile(filename):
    # gets str in a file
    file = open(filename)
    results = file.read()
    file.close()
    return results

def gen_results(path):
    # Gets all the files in the specified path
    results = []
    for obj in os.listdir(path):
        new_path = os.path.join(path, obj)
        if os.path.isdir(new_path):
            results += gen_results(new_path)
        else:
            results.append(new_path)
    return results

def to_xml_info(filename):
    # formats relevant information into a json string
    root = ET.parse(filename).getroot()
    name = filename.split("/")[-1][:-4]
    tileset = root.find("tileset").attrib["source"].split("/")[-1]
    result = '\t"' + name + '": {\n'
    result += '\t\t"name": "' + name + '",\n'
    result += '\t\t"tileset": "' + tileset + '",\n' 
    result += '\t\t"layers": {\n'
    for layer in root.findall('layer'):
        result += '\t\t\t"' + layer.attrib["name"] + '": [\n'
        result += '\t\t\t\t"' + layer.find("data").text.replace("\n", "") + "\n"
        result += '\t\t\t],\n'
    result += '\t\t}\n'
    result += '\t}'
    return result

def generate_map_file(levels):
    result = "define([],\nfunction()\n{\n"
    for level in levels:
        result += to_xml_info(level) + ",\n"
    result += "});"
    file = open("maps.js", "w")
    file.write(result)
    file.close()
    
def rewrite_assets(tilesets):
    for tileset in tilesets:
        pass
        # tilset.js file, similar to levels. load tileset on request
        # offsets for all the tile ids
        # json list as well
        """
        tilesets: {
            tileset_name: 
                {
                    x_offset:
                    y_offset: 
                    properties: 
                }
            ]
        }
        """

maps = gen_results(LEVELS_DIR)
generate_map_file(maps)
tilesets = gen_results(ASSETS_DIR)
rewrite_assets(tilesets)
