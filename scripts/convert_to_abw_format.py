import json
import sys
import pprint
import urllib.parse


input_path = sys.argv[1]

with open(input_path, 'r') as f:
    data = json.load(f)

def modify_node(node):
    del node['linkedAnnotation']

    node['content'] = node['label']
    del node['label']

    node['uri'] = get_tag_uri(node['value'])
    del node['value']


def get_tag_uri(value):
    return "tag:solasistim.net,2019-07-04:{}".format(urllib.parse.quote(value))

def handle_child(node):
    modify_node(node)

    children = node.get('children')
    if children is not None:
        for child in children:
            handle_child(child)


def modify_structure(structure):
    if len(structure) != 1:
        raise Exception("ambiguous root node")

    root_node = structure[0]
    modify_node(root_node)
    
    for child in root_node['children']:
        handle_child(child)


    return root_node

data = modify_structure(data)

json.dump(data, sys.stdout, indent=4)

