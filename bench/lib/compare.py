#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import json
import codecs
import os
import collections
import subprocess


DATAFILE_NAME = 'data.dat'
PLOTFILE_NAME = 'plot'


def get_hist(filename):
    with open(filename) as uni_data:
        return dict(json.load(uni_data));


def get_name(filename):
    return os.path.splitext(filename)[0]


def get_sorted_buckets(storage):
    buckets = set()

    for value in storage.itervalues():
        buckets.update(value.keys())

    return sorted(buckets)


storage = {}

for jsonfile in sys.argv[2:]:
    storage[get_name(jsonfile)] = get_hist(jsonfile)

shootings_names = sorted(storage.keys())
buckets = get_sorted_buckets(storage)
normalized_data = collections.OrderedDict()

for bucket in buckets:
    requests = []
    for name in shootings_names:
        requests.append(storage[name].get(bucket, 0))
    normalized_data[bucket] = requests

datafile = codecs.open(DATAFILE_NAME, 'w', 'utf-8')
plotfile = codecs.open(PLOTFILE_NAME, 'w', 'utf-8')

for bucket, requests in normalized_data.iteritems():
    datafile.write('%d %s\n' % (bucket, ' '.join(str(x) for x in requests)))

plotfile.write("""set terminal svg size 1024, 768
set ylabel 'requests'
set xlabel 'ms'
plot """)

for i, name in enumerate(shootings_names):
    plotfile.write("'{datafile}' using 1:{pos} with lines title '{name}'{delim}".format(
        datafile=DATAFILE_NAME,
        pos=i + 2,
        name=name,
        delim=(', ', '\n')[i == len(shootings_names) - 1]
        ))

    subprocess.call('gnuplot {name} > {dir}/out.svg'.format(
        name=PLOTFILE_NAME,
        dir=sys.argv[1]
        ) , shell=True)

# os.remove(DATAFILE_NAME)
# os.remove(PLOTFILE_NAME)

