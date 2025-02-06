import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './nillionOrgConfig.js';
import schema from './schema.json' with { type: 'json' };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );

    await org.init();

    const collectionName = 'Secret Documents';
    const newSchema = await org.createSchema(schema, collectionName);

    console.log('New schema:', newSchema);
    console.log('Schema ID:', newSchema[0].result.data);
  } catch (error) {
    console.error('Failed to create schema:', error.message);
    process.exit(1);
  }
}

main();
