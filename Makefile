LUA_DIR = /usr/local

.PHONY : install uninstall

install:
	cp pash $(LUA_DIR)/bin
                
uninstall:
	-rm $(LUA_DIR)/bin/pash
