import fabric
import patchwork.transfers

c = fabric.Connection('visarend.solasistim.net')
c.run('/bin/true')

print(patchwork.transfers.rsync)

# Trailing slash needed
source = 'dist/'
target = '/srv/http/solasistim/shl/mule'

configuration = {
    'c': c,
    'source': source,
    'target': target,
    'delete': True
}

patchwork.transfers.rsync(**configuration)
