check-code:
	yarn tsc:check
	# yarn eslint:check
	yarn prettier:check

test:
	yarn test

codegen:
	yarn codegen

# 16 is exit code for critical https://classic.yarnpkg.com/lang/en/docs/cli/audit
audit:
	bash -c 'yarn audit --level critical; [[ $$? -ge 16 ]] && exit 1 || exit 0'
