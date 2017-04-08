tests:
	nodeunit test/

jsl:
	find ! -name '*.min.js' -exec jsl -nologo -process {} \;

default:
	tests jsl



.PHONY: default tests jsl
