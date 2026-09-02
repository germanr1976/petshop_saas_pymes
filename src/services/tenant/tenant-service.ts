export async function listTenants() {
    return [
        {
            id: 'tenant-demo',
            name: 'Pet Shop Demo',
            slug: 'pet-shop-demo',
            status: 'ACTIVE',
        },
    ];
}
