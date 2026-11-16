export function mapCountryResponse(raw) {
    return {
        name: raw.name,
        flag: raw.flags?.svg ?? raw.flags?.png ?? '',
        capital: raw.capital ?? null,
        region: raw.region,
        population: raw.population,
        languages: raw.languages?.map((lang) => lang.name) ?? [],
    };
}
//# sourceMappingURL=mapper.js.map