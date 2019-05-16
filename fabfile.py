import fabric
import patchwork.transfers

c = fabric.Connection('visarend.solasistim.net')
c.run("/bin/true")
c.local("/usr/bin/npm run build", replace_env=False)

# Trailing slash needed
source = 'dist/'
target = '/srv/http/mule'

configuration = {
    'c': c,
    'source': source,
    'target': target,
    'delete': True
}

patchwork.transfers.rsync(**configuration)
