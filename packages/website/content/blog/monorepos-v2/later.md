```sh
#!/bin/bash
npx concurrently -n "dev-models,dev-ui,dev-server" \
                 -c "yellow,blue,green" \
                 "pnpm --filter=@seeds/models --stream run dev" \
                 "pnpm --filter=@seeds/ui --stream run dev" \
                 "pnpm --filter=@seeds/server --stream run dev"

```