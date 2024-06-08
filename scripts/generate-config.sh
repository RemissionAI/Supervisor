#!/bin/bash

# load environment variables
if [ -f .env ]; then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

ENVIRONMENT=${1:-dev}

CONFIG_FILE="wrangler.template.toml"
OUTPUT_FILE="wrangler.toml"

# cleanup previous output file
if [ -f "$OUTPUT_FILE" ]; then
  rm "$OUTPUT_FILE"
fi

[ -z "$CF_ACCOUNT_ID" ] && echo "CF_ACCOUNT_ID is not set" && exit 1 || echo "CF_ACCOUNT_ID is set and has length ${#CF_ACCOUNT_ID}"
[ -z "$STAGING_SCRIPT_NAME" ] && echo "STAGING_SCRIPT_NAME is not set" && exit 1 || echo "STAGING_SCRIPT_NAME is set and has length ${#STAGING_SCRIPT_NAME}"
[ -z "$STAGING_KV_ID" ] && echo "STAGING_KV_ID is not set" && exit 1 || echo "STAGING_KV_ID is set and has length ${#STAGING_KV_ID}"
[ -z "$STAGING_BUCKET_NAME" ] && echo "STAGING_BUCKET_NAME is not set" && exit 1 || echo "STAGING_BUCKET_NAME is set and has length ${#STAGING_BUCKET_NAME}"
[ -z "$STAGING_DATABASE_ID" ] && echo "STAGING_DATABASE_ID is not set" && exit 1 || echo "STAGING_DATABASE_ID is set and has length ${#STAGING_DATABASE_ID}"
[ -z "$STAGING_DATABASE_NAME" ] && echo "STAGING_DATABASE_NAME is not set" && exit 1 || echo "STAGING_DATABASE_NAME is set and has length ${#STAGING_DATABASE_NAME}"
[ -z "$STAGING_TRAINING_QUEUE" ] && echo "STAGING_TRAINING_QUEUE is not set" && exit 1 || echo "STAGING_TRAINING_QUEUE is set and has length ${#STAGING_TRAINING_QUEUE}"

replace_placeholders() {
  local env=$1
  local script_name_var="${env}_SCRIPT_NAME"
  local kv_id_var="${env}_KV_ID"
  local bucket_name_var="${env}_BUCKET_NAME"
  local vectorize_index_name_var="${env}_VECTORIZE_INDEX"
  local database_name_var="${env}_DATABASE_NAME"
  local database_id_var="${env}_DATABASE_ID"
  local training_queue_var="${env}_TRAINING_QUEUE"
  
  sed -e "s/__CF_ACCOUNT_ID__/${CF_ACCOUNT_ID}/g" \
      -e "s/__${env}_SCRIPT_NAME__/${!script_name_var}/g" \
      -e "s/__${env}_KV_ID__/${!kv_id_var}/g" \
      -e "s/__${env}_BUCKET_NAME__/${!bucket_name_var}/g" \
      -e "s/__${env}_VECTORIZE_INDEX__/${!vectorize_index_name_var}/g" \
      -e "s/__${env}_DATABASE_NAME__/${!database_name_var}/g" \
      -e "s/__${env}_DATABASE_ID__/${!database_id_var}/g" \
      -e "s/__${env}_TRAINING_QUEUE__/${!training_queue_var}/g" \
      "$CONFIG_FILE" > "$OUTPUT_FILE"
}

# replace placeholder based on the environment
case "$ENVIRONMENT" in
  dev)
    replace_placeholders "DEV"
    ;;
  staging)
    replace_placeholders "STAGING"
    ;;
  production)
    replace_placeholders "PRODUCTION"
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "Config file wrangler.toml generated successfully. ✅"

grep "__" "$OUTPUT_FILE" && echo "Replacement error: Placeholders still exist in the output file" && exit 1

cat "$OUTPUT_FILE"