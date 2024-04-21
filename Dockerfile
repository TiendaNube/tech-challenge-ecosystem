FROM python:3.11-alpine
    ENV APPDIR /usr/payables
    WORKDIR ${APPDIR}
    ADD requirements.txt .
    RUN pip install -r requirements.txt
    # COPY . ${APPDIR}/
    CMD uvicorn src.server:app --reload --port ${WEB_SERVER_PORT} --host ${WEB_SERVER_HOST} --workers ${WEB_SERVER_WORKERS}