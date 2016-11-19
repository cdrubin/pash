LUA_DIR = /usr/local
LUA_VERSION = `lua -e 'print(_VERSION:sub(5,7))'`
LUA_SHARE = $(LUA_DIR)/share/lua/$(LUA_VERSION)

.PHONY : install uninstall

install:
	cp pash.lua $(LUA_SHARE)
	cp pash $(LUA_DIR)/bin
                
uninstall:
	-rm $(LUA_SHARE)/pash.lua
	-rm $(LUA_DIR)/bin/pash
