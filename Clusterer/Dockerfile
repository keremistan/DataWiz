FROM python:3

RUN apt-get update
RUN python3 -m pip install --upgrade pip setuptools wheel

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

# Install evoStream 
RUN cd ./lib/evostream && python3 setup.py install --force

CMD [ "python3", "./app.py" ]