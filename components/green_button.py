import pandas as pd
from xml.etree.ElementTree import parse
from datetime import datetime


def Convert(input_file):
    """
    input_file: a file path from which the XML data is parsed
    returns: pandas DataFrame containing the parsed data
    """
    # Set up a namespace for the various XML namespaces in the document
    ns = {
        'Atom': "http://www.w3.org/2005/Atom",
        'espi': "http://naesb.org/espi",
        'xsi:schemaLocation': "http://naesb.org/espi espiDerived.xsd",
        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance"
    }

    # Parse the XML tree
    tree = parse(input_file)
    root = tree.getroot()

    data = []  # Initialize an empty list to store row data

    # Iterate through each entry in the XML
    for entry in root.findall('.//espi:IntervalReading', namespaces=ns):
        # Retrieve data for each entry
        start_time = get_child_node_text(entry, ns, 'start')
        duration = get_child_node_text(entry, ns, 'duration')
        value = get_child_node_text(entry, ns, 'value')

        # Convert start time to datetime
        start_datetime = datetime.utcfromtimestamp(int(start_time))
        end_datetime = datetime.utcfromtimestamp(int(start_time) + int(duration))

        # Append the data to the list
        data.append({
            'Start Date (Required)': start_datetime,
            'End Date (Required)': end_datetime,
            'Meter Reading (Required)': float(value) if value else None,
        })

    return pd.DataFrame(data)


def get_child_node_text(node, ns, tag):
    """
    Helper function to extract text from a specified child node
    """
    child = node.find(f'.//espi:{tag}', namespaces=ns)
    return child.text if child is not None and child.text is not None else None