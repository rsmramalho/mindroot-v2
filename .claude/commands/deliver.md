Package the current changes for delivery:

1. Run `npx tsc --noEmit` — must pass with zero errors
2. Run `npm run build` — must succeed
3. Run `npm test -- --run` — report results
4. Identify all files modified or created (use `git status` and `git diff --name-only`)
5. Create a .zip containing only the changed/new files, preserving the `src/...` folder structure
6. List clear instructions:
   - Which files to extract and where
   - Which files to delete (if any)
   - Any new dependencies to install
   - Commands to run after applying
