export function getUnicId()
{
    const uniqueId = `id-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    return uniqueId;
}