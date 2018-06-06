#!/bin/bash

icon=icon1024.png
dest="platforms/ios/Koala Watch/Images.xcassets/AppIcon.appiconset"

if [ ! -e "${icon}" ]; then
    echo "Did not find "${icon}", bye"
    exit 0
fi

if [ ! -d "${dest}" ]; then
    echo "Did not find directory, ${dest}"
    exit 0
fi

resize() {
    file "${dest}/${1}"
    convert "${icon}" -resize ${2} "${dest}/${1}"
    file "${dest}/${1}"
}

resize AppIcon29x29@2x.png 58x58
resize AppIcon29x29@3x.png 87x87
resize AppIcon40x40@2x.png 80x80
resize AppIcon98x98@2x.png 196x196
resize AppIcon86x86@2x.png 172x172 
resize AppIcon44x44@2x.png 88x88
resize AppIcon27.5x27.5@2x.png 55x55
resize AppIcon24x24@2x.png 48x48
resize icon-1024.png 1024x1024
resize icon-20.png 20x20
resize icon-20@2x.png 40x40
resize icon-20@3x.png 60x60
resize icon-40.png 40x40
resize icon-40@2x.png 80x80
resize icon-50.png 50x50
resize icon-50@2x.png 100x100
resize icon-60@2x.png 120x120
resize icon-60@3x.png 180x180
resize icon-72.png 72x72
resize icon-72@2x.png 144x144
resize icon-76.png 76x76
resize icon-76@2x.png 152x152
resize icon-83.5@2x.png 167x167
resize icon-small.png 29x29
resize icon-small@2x.png 58x58
resize icon-small@3x.png 87x87
resize icon.png 57x57
resize icon@2x.png 114x114

exit 0

