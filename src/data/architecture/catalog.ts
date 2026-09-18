import type { ArchitecturalModel } from './types';
import { edfuArchitecture } from './edfu';
import { nmecArchitectureLevels } from './nmec';
import { gemArchitectureLevels } from './gem';
import { abuArchitectureLevels } from './abu';
import { luxorArchitecture } from './luxor';
import { hatshepsutArchitectureLevels } from './hatshepsut';
import { komArchitecture } from './kom';
import { karnakArchitectureLevels } from './karnak';
import { valleyArchitectureLevels } from './valley';
import { citadelArchitectureLevels } from './citadel';
import { gizaArchitectureLevels } from './giza';
import khan from './khan-outdoor.json';
import memnon from './memnon-outdoor.json';
import orange from './orange-outdoor.json';
export const architectureCatalog:Record<string,ArchitecturalModel[]>={
 'edfu-temple':[edfuArchitecture],
 'national-museum-egyptian-civilization':nmecArchitectureLevels,
 'grand-egyptian-museum':gemArchitectureLevels,
 'abu-simbel':abuArchitectureLevels,
 'luxor-temple':[luxorArchitecture],
 'hatshepsut-temple':hatshepsutArchitectureLevels,
 'kom-ombo':[komArchitecture],
 'karnak':karnakArchitectureLevels,
 'valley-of-the-kings':valleyArchitectureLevels,
 'cairo-citadel':citadelArchitectureLevels,
 'giza-plateau':gizaArchitectureLevels,
 'khan-el-khalili':[khan as unknown as ArchitecturalModel],
 'colossi-of-memnon':[memnon as unknown as ArchitecturalModel],
 'orange-bay':[orange as unknown as ArchitecturalModel],
};
