FROM python:3.11-alpine
    ENV APPDIR /usr/payables
    WORKDIR ${APPDIR}
    ADD requirements.txt .
    RUN pip install -r requirements.txt
    # COPY . ${APPDIR}/
    CMD uvicorn src.server:app --reload --port ${SERVER_PORT} --host ${SERVER_HOST} --workers ${SERVER_WORKERS}