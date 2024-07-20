import multiprocessing

bind = '0.0.0.0:8000'
workers = multiprocessing.cpu_count() * 2 + 1

# Logging
loglevel = 'info'
accesslog = '/var/log/gunicorn/etl_access.log'
errorlog = '/var/log/gunicorn/etl_error.log'
