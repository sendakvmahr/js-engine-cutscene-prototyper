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
    tileheight = root.attrib["tileheight"].split("/")[-1]
    tilewidth = root.attrib["tilewidth"].split("/")[-1]
    width = root.attrib["width"].split("/")[-1]
    height = root.attrib["height"].split("/")[-1]
    result = '\t"' + name + '": {\n'
    result += '\t\t"name": "' + name + '",\n'
    result += ('\t\t"tileset": "' + tileset + '",\n').replace(".tsx", "")
    result += '\t\t"tilewidth": "' + tilewidth + '",\n' 
    result += '\t\t"tileheight": "' + tileheight + '",\n' 
    result += '\t\t"width": "' + width + '",\n' 
    result += '\t\t"height": "' + height + '",\n' 
    result += '\t\t"layers": {\n'
    for layer in root.findall('layer'):
        result += '\t\t\t"' + layer.attrib["name"] + '": [\n'
        result += '\t\t\t\t' + layer.find("data").text.replace("\n", "") + "\n"
        result += '\t\t\t],\n'
    result += '\t\t}\n'
    result += '\t}'
    return result

def generate_map_file(levels):
    result = "define([],\nfunction()\n{\nmaps = \n{"
    for level in levels:
        result += to_xml_info(level) + ",\n"
    result += "}\n"
    result += "return maps;\n"
    result += "});"
    file = open("maps.js", "w")
    file.write(result)
    file.close()

def from_xml_tileset(filename):
    # formats relevant information into a json string
    root = ET.parse(filename).getroot()
    name = filename.split("/")[-1].replace(".tsx", "")
    _image = root.find("image")
    image = _image.attrib["source"].split("/")[-1]
    width = _image.attrib["width"]
    height = _image.attrib["height"]

    result = '\t"' + name + '": {\n'
    result += '\t\t"name": "' + name + '",\n'
    result += '\t\t"image": "' + image + '",\n' 
    result += '\t\t"width": "' + width + '",\n' 
    result += '\t\t"height": "' + height + '",\n' 
    result += '\t\t"properties": [\n'
    for tile in root.findall('tile'):
        result += '\t\t\t{\n\t\t\t\t"id": ' + tile.attrib["id"] + ",\n"
        for p in tile.find("properties").findall("property"):
            result += '\t\t\t\t"{}": "{}",\n'.format(p.attrib["name"], p.attrib["value"])
        result += '\t\t\t},\n'
    result += '\t\t]\n'
    result += '\t},\n'
    result += '}\n'
    return result
    
def rewrite_assets(tilesets):
    result = "define([],\nfunction()\n{\ntiles = \n{\n"
    for tileset in tilesets:
        result += from_xml_tileset(tileset)
    result += "return tiles;\n"
    result += "});"
    file = open("tilesets.js", "w")
    file.write(result)
    file.close()


maps = gen_results(LEVELS_DIR)
generate_map_file(maps)

#tilesets = gen_results(ASSETS_DIR)
#rewrite_assets(tilesets)
