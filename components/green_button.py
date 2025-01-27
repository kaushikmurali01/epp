import csv
from datetime import datetime
from xml.etree.ElementTree import parse
from dataclasses import dataclass

import pandas as pd


prefixes = {
    '0': 1,  # No scaling
    '1': 10,
    '2': 100,
    '-1': 0.1,  # Deci
    '-2': 0.01,  # Centi
    '-3': 0.001,  # Milli
    '-6': 1e-6,  # Micro
    '-9': 1e-9,  # Nano
    '-12': 1e-12,  # Pico
    '3': 1000,  # Kilo
    '6': 1e6,  # Mega
    '9': 1e9,  # Giga
    '12': 1e12  # Tera
}

@dataclass
class GreenButtonData:
    columns = []
    rows = []
    offset = None
    uom = None
    powerOfTenMultiplier = None


gb = GreenButtonData()


def Convert(input_file):
    ns = {
        'espi': "http://naesb.org/espi"
    }

    csv.register_dialect('csvdialect', delimiter=',', lineterminator='\n', quoting=csv.QUOTE_NONNUMERIC)

    tree = parse(input_file)
    root = tree.getroot()
    tzOffset = get_child_node_text(root, ns, 'tzOffset')
    powerOfTenMultiplier = get_child_node_text(root, ns, "powerOfTenMultiplier")
    gb.offset = int(tzOffset)
    gb.powerOfTenMultiplier = powerOfTenMultiplier
    # writer = csv.writer(output_file, 'csvdialect')
    headers = ['Start Timestamp', 'Duration (Seconds)', 'End Timestamp', 'Cost', 'Meter Reading', 'Reading Quality']
    gb.columns = headers
    # writer.writerow(headers)

    rows_written = 0
    for node in root.findall('.//espi:IntervalReading', namespaces=ns):
        row = process_row(node, ns)
        gb.rows.append(row)
        # writer.writerow(row)
        rows_written += 1

    df = pd.DataFrame(gb.rows, columns=gb.columns)
    df = df[['Start Timestamp', 'End Timestamp', 'Meter Reading']].rename(columns={
        'Start Timestamp': 'Start Date (Required)',
        'End Timestamp': 'End Date (Required)',
        'Meter Reading': 'Meter Reading (Required)'
    })
    df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'])
    df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'])

    # gbd.offset is -18000 seconds
    # Apply the offset in seconds directly
    df['Start Date (Required)'] += pd.to_timedelta(gb.offset, unit='s')
    df['End Date (Required)'] += pd.to_timedelta(gb.offset, unit='s')
    df['Meter Reading (Required)'] = pd.to_numeric(df['Meter Reading (Required)'], errors='coerce')

    df['Meter Reading (Required)'] = df.apply(
        lambda row: (row['Meter Reading (Required)'] * prefixes.get(str(row['powerOfTenMultiplier']), 1)) / 1000, axis=1
    )
    # df['Meter Reading (Required)'] = df.apply(
    #     lambda row: row['Meter Reading (Required)'] * prefixes.get(str(gb.powerOfTenMultiplier)), axis=1)
    print(df.head())
    return df


def process_row(node, ns):
    interval_date = get_child_node_text(node, ns, 'start')
    formatted_date = datetime.utcfromtimestamp(int(interval_date))
    interval_duration = get_child_node_text(node, ns, "duration")
    interval_cost = get_child_node_text(node, ns, "cost")
    interval_reading_quality = QUALITY_OF_READING.get(get_child_node_text(node, ns, "quality"), "Unknown quality")
    interval_value = get_child_node_text(node, ns, "value")

    end_date = datetime.utcfromtimestamp(
        int(interval_date) + int(interval_duration)) if interval_duration else formatted_date
    cost = float(interval_cost) / 100000 if interval_cost else 0

    return [formatted_date, interval_duration, end_date, cost, interval_value, interval_reading_quality]


def get_child_node_text(node, ns, node_tag):
    child_node = node.find(f'.//espi:{node_tag}', namespaces=ns)
    return child_node.text if child_node is not None and child_node.text is not None else ""


QUALITY_OF_READING = {
    '0': 'valid',
    '7': 'manually edited',
    '8': 'estimated using reference day',
    '9': 'estimated using linear interpolation',
    '10': 'questionable',
    '11': 'derived',
    '12': 'projected (forecast)',
    '13': 'mixed',
    '14': 'raw',
    '15': 'normalized for weather',
    '16': 'other',
    '17': 'validated',
    '18': 'verified',
    '19': 'revenue-quality',
}
