# /src/libs/Makefile
CC=emcc
CFLAGS=-I. -I/lua-5.3.4-32/src -s WASM=1 -s SUPPORT_LONGJMP=1

libs/zkp.o: zkp.h
	mkdir -p libs
	$(CC) -x c -c $< -o $@ $(CFLAGS)

.PHONY: clean
clean:
	rm -rf *.o