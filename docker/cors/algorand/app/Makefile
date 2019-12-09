.PHONY: bootstrap kill serve start

bootstrap:
	@echo Starting a kmd process for each node
	@goal kmd start -d ./demo-network/Primary > /dev/null
	@goal kmd start -d ./demo-network/Kilgore > /dev/null
	@goal kmd start -d ./demo-network/Trout > /dev/null

kill:
	@echo Killing demo-network
	@goal network stop -r ./demo-network
	@goal network delete -r ./demo-network
	@echo Killing kmd processes
	@-pkill kmd
	@echo Killing python SimpleHTTPServer
	@-kill -9 $$(lsof -ti:8000) 2> /dev/null

serve:
	@echo Starting python SimpleHTTPServer on port 8000
	@python -m SimpleHTTPServer 8000 &> /dev/null

start: bootstrap serve

