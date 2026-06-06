import boto3
from botocore.exceptions import ClientError
from core.config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def generate_presigned_url(file_name: str, file_type: str) -> dict:
    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": AWS_BUCKET_NAME,
                "Key": file_name,
                "ContentType": file_type
            },
            ExpiresIn=300
        )
        file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
        return {
            "presigned_url": presigned_url,
            "file_url": file_url
        }
    except ClientError as e:
        raise ValueError(f"Could not generate presigned URL: {str(e)}")