const dns = require('dns');

console.log('🔍 Testing DNS resolution...\n');

const hosts = [
    'cluster0.ggtzdob.mongodb.net',
    'cluster0-shard-00-00.ggtzdob.mongodb.net',
    'cluster0-shard-00-01.ggtzdob.mongodb.net',
    'cluster0-shard-00-02.ggtzdob.mongodb.net'
];

hosts.forEach(host => {
    dns.lookup(host, (err, address) => {
        if (err) {
            console.log(`❌ ${host}: ${err.message}`);
        } else {
            console.log(`✅ ${host}: ${address}`);
        }
    });
});

// Test SRV records
dns.resolveSrv('_mongodb._tcp.cluster0.ggtzdob.mongodb.net', (err, addresses) => {
    console.log('\n🔍 Testing SRV records...');
    if (err) {
        console.log(`❌ SRV lookup failed: ${err.message}`);
    } else {
        console.log(`✅ SRV records found:`, addresses);
    }
});