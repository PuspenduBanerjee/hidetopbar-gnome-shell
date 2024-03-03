SHELL := /bin/bash

JS_FILES = $(shell echo {extension,convenience,intellihide,panelVisibilityManager,prefs,desktopIconsIntegration}.js)
UI_FILES = $(shell echo {Settings-40,Settings}.ui)

LOCALES_PO = $(wildcard locale/*/*/*.po)
LOCALES_MO = $(patsubst %.po,%.mo,$(LOCALES_PO))

EXTENSION_UUID := $(shell grep -n uuid metadata.json | cut -d '"' -f 4)
EXTENSION_ZIP := $(EXTENSION_UUID).shell-extension.zip


.PHONY: distclean clean all all-po

all: hidetopbar.zip

schemas/gschemas.compiled:
	glib-compile-schemas --strict ./schemas/

hidetopbar.zip: schemas/gschemas.compiled $(LOCALES_MO)
	zip ${EXTENSION_ZIP} -r COPYING.txt $(JS_FILES) metadata.json $(LOCALES_MO) schemas Settings.ui Settings-40.ui

inst: all
	echo "$(EXTENSION_UUID)"
	# gnome-extensions uninstall $(EXTENSION_UUID) ; true
	gnome-extensions install --force ${EXTENSION_ZIP}
	# gnome-extensions enable  \"$(EXTENSION_UUID)\"	; true
	gnome-shell --replace ; true
	gnome-extensions info $(EXTENSION_UUID) ; true
		


clean:
	rm -rf ${EXTENSION_ZIP} schemas/gschemas.compiled ${LOCALES_MO}

distclean: clean
	rm -rf locale/hidetopbar.pot-stamp

%.mo: %.po locale/hidetopbar.pot locale/hidetopbar.pot-stamp
	msgfmt -c -o $@ $<

%.po: locale/hidetopbar.pot locale/hidetopbar.pot-stamp
	@echo "Updating $@"
	@msgmerge --previous --update $@ $<

all-po: $(LOCALES_PO)

locale/hidetopbar.pot locale/hidetopbar.pot-stamp : $(UI_FILES)
	xgettext --copyright-holder="Thomas Vogt" \
			 --package-name="Hide Top Bar" \
			 --output=locale/hidetopbar.pot \
			 $(JS_FILES) $(UI_FILES)
	sed -i '1s/.*/# <LANGUAGE> translation for the Hide Top Bar extension./' locale/hidetopbar.pot
	sed -i "2s/.*/# Copyright (C) $$(date +%Y) Thomas Vogt/" locale/hidetopbar.pot
	sed -i '17s/CHARSET/UTF-8/' locale/hidetopbar.pot
	touch locale/hidetopbar.pot-stamp
