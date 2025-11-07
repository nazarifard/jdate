#!/bin/sh
cat calendar.js jdate-class.js > jdate.js
npx terser jdate.js -o out.min.js  \
           --compress ecma=2020,passes=3,unsafe=true,drop_console=true \
           --mangle toplevel=true
echo -n "(function(){"`cat out.min.js`"}());" > jdate.min.js 
rm out.min.js jdate.js
