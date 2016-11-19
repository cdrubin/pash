package = "pash"
version = "1.0"

source = {
   url = "git://github.com/cdrubin/pash"
   tag = "1.0"
}

description = {
  summary = "Plain static-site generator using templet.",
  detailed = "Plain static-site generator using templet.",
  homepage = "http://...", -- We don't have one yet,
  license = "MIT"
}
  
dependencies = {
  "lua >= 5.1, < 5.4",
  "luafilesystem",
  "lua-templet",
  "inspect"
}
  
build = {
  type = "make"
  install_variables = {
    PREFIX = "$(PREFIX)",
    LUADIR = "$(LUADIR)",
    DOCDIR = "$(PREFIX)/doc",
  },
  copy_directories = {
  }
}
