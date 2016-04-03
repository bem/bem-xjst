#!/bin/sh

git log --reverse --format='%aN <%aE>' | sort | uniq -c | sort -bgr > AUTHORS

