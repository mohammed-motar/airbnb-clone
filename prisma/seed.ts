import { syncDemoListingsToDatabase } from '@/lib/sync-demo-listings';

async function main() {
  await syncDemoListingsToDatabase();
}

main()
  .then(() => {
    process.stdout.write('Demo Listings seeded successfully. \n');
  })
  .catch((error) => {
    process.stderr.write(
      `Seed failed: ${error instanceof Error ? error.message : String(error)} \n`,
    );
    process.exitCode = 1;
  });
