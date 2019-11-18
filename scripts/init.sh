set -e

rm ./node_modules/@types/strict-event-emitter-types/ -rf
mkdir ./node_modules/@types/strict-event-emitter-types/
cp ./node_modules/strict-event-emitter-types/types/src/index.d.ts ./node_modules/@types/strict-event-emitter-types/index.d.ts
