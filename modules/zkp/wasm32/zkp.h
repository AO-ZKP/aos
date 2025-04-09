#ifndef ZKP_H
#define ZKP_H

#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <lua.h>
#include <lauxlib.h>
#include <string.h>

// Original zkp.h declarations
const char *keccak(const char *input_ptr);
const char *verify(const char *input_ptr);

// Lua bindings
static int l_verify(lua_State* L) {
    const char* input = luaL_checkstring(L, 1);
    const char* result = verify(input);
    lua_pushstring(L, result);
    return 1;
}

static int l_keccak(lua_State* L) {
    const char* input = luaL_checkstring(L, 1);
    const char* result = keccak(input);
    lua_pushstring(L, result);
    return 1;
}

static const struct luaL_Reg groth16_functions[] = {
    {"verify", l_verify},
    {"keccak", l_keccak},
    {NULL, NULL}
};

__attribute__((visibility("default")))
int luaopen_groth16(lua_State* L) {
    luaL_newlib(L, groth16_functions);
    return 1;
}

#endif // ZKP_H