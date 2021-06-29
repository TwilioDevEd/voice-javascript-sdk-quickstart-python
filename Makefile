.PHONY: venv install serve
UNAME := $(shell uname)

venv:
ifeq ($(UNAME), Windows)
	py -3 -m venv venv;
else
	python3 -m venv venv
endif

install: venv
ifeq ($(UNAME), Windows)
	venv\Scripts\activate.bat; \
	pip3 install -r requirements.txt;
else
	. venv/bin/activate; \
	pip3 install -r requirements.txt;
endif

serve:
ifeq ($(UNAME), Windows)
	venv\Scripts\activate.bat; \
	python3 app.py
else
	. venv/bin/activate; \
	python3 app.py
endif
