METER_FACTOR = 3
IV_FACTOR = 1.5

SUFFICIENCY_DATA = {"daily": {"sufficiency": 46.86, "status": "passed"},
                    "hourly": {"sufficiency": 46.52, "status": "passed"},
                    "monthly": {"sufficiency": 46.52, "status": "passed",
                                "data": [{"month": "June 2023", "value": "0.00"},
                                         {"month": "July 2023", "value": "0.00"},
                                         {"month": "August 2023", "value": "0.00"},
                                         {"month": "September 2023", "value": "0.00"},
                                         {"month": "October 2023", "value": "0.00"},
                                         {"month": "November 2023", "value": "0.00"},
                                         {"month": "December 2023", "value": "0.00"},
                                         {"month": "January 2024", "value": "100.00"},
                                         {"month": "February 2024", "value": "99.86"},
                                         {"month": "March 2024", "value": "99.46"},
                                         {"month": "April 2024", "value": "99.86"},
                                         {"month": "May 2024", "value": "99.87"},
                                         {"month": "June 2024", "value": "63.47"}]}}

EXPORT_STATUS = {0: 'In Progress', 1: 'Completed', 2: 'Failed'}
EXPORT_TYPE = {1: 'Data Exploration', 2: 'Performance Data Summary', 3: 'Raw Data',
               4: 'Base Line Observed vs Predicted', 5: 'Performance Observed vs Predicted'}
EXPORT_MESSAGE = [
    (1, 'Data Exploration Summary Report'),
    (2, 'Performance Data Summary Report '),
    (3, 'Raw Data Report'),
    (4, 'Base Line Report'),
    (5, 'Performance Report')
]



