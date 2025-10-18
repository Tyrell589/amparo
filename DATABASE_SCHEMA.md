# 🗄️ PJF_Amparos Database Schema Documentation

## 📊 Database Overview

**Database Name**: PJF_Amparos  
**Purpose**: Legal Case Management System for Amparo (Constitutional Protection) Cases  
**Total Tables**: 17  
**Total Columns**: 124  
**Stored Procedures**: 8  

---

## 📁 Table Categories

### 1️⃣ **Catalog Tables** (Reference Data)
- Cat_Perfil
- Cat_Juzgados
- Cat_Distritos
- Cat_TipoAsunto
- Cat_TipoCuaderno
- Cat_ClasificacionArchivo

### 2️⃣ **Core Business Tables**
- Usuarios
- Expediente
- PartesExpediente
- Notificacion
- AmparosPJ

### 3️⃣ **Document Management**
- DocumentosNotificacion
- DocumentosPromocion
- DetalleActosReclamados
- Promocion

### 4️⃣ **Integration Tables**
- ICOIJ_Solicitud
- ICOIJ_FIRMA_CAT_AC

---

## 📋 Detailed Table Information

### 1. **Usuarios** (Users)
**Purpose**: System users who manage Amparo cases

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| IdUsuario | int | - | No | Primary Key (auto-increment) |
| organo_impartidor_justicia | int | - | No | FK to Cat_Juzgados |
| Nombre | varchar | 50 | No | First name |
| APaterno | varchar | 50 | No | Paternal last name |
| AMaterno | varchar | 50 | No | Maternal last name |
| Usuario | varchar | 20 | No | Username (unique) |
| Correo | varchar | 100 | No | Email (unique) |
| Clave | varchar | 20 | No | Password (hashed) |
| Telefono | varchar | 10 | No | Phone number |
| Extensión | varchar | 5 | No | Extension |
| Estado | varchar | 1 | No | Status: 'A'=Active, 'I'=Inactive |
| id_perfil | int | - | No | FK to Cat_Perfil |
| Eliminado | bit | - | No | Soft delete flag (0=active, 1=deleted) |

**Relationships**:
- → Cat_Juzgados (via organo_impartidor_justicia)
- → Cat_Perfil (via id_perfil)

**Row Count**: 0

---

### 2. **Cat_Perfil** (User Profiles/Roles)
**Purpose**: User role definitions

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_perfil | int | - | No | Primary Key (auto-increment) |
| Nombre | varchar | 200 | No | Profile name |
| Eliminado | bit | - | No | Soft delete flag |

**Sample Data**:
- Administrador
- Secretario
- Oficial de Partes
- Consulta

**Row Count**: 4

---

### 3. **Cat_Juzgados** (Judicial Courts)
**Purpose**: Catalog of judicial courts/organs

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| IdJuzgadoPJHGO | int | - | No | Juzgado ID from CJF system |
| Clave | varchar | 4 | No | Court code |
| Nombre | varchar | 200 | No | Court name |
| TipoJuicio | varchar | 1 | No | Type of trial |
| IdDistrito | int | - | No | FK to Cat_Distritos |
| organo_impartidor_justicia | int | - | No | **Primary Key** - Organ ID |
| Correo | varchar | 255 | Yes | Contact email |
| Eliminado | bit | - | Yes | Soft delete flag |

**Relationships**:
- → Cat_Distritos (via IdDistrito)

**Row Count**: 4

---

### 4. **Cat_Distritos** (Districts)
**Purpose**: Judicial district catalog

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| IdDistrito | int | - | No | Primary Key |
| Distrito | varchar | 10 | No | District code |
| Nombre | varchar | 100 | No | District name |
| Tipo | char | 1 | Yes | District type |
| Eliminado | bit | - | No | Soft delete flag |

**Row Count**: 2

---

### 5. **Cat_TipoAsunto** (Case Types)
**Purpose**: Types of Amparo cases

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_tipoAsunto | int | - | No | Primary Key |
| Nombre | varchar | 200 | No | Case type name |
| Eliminado | bit | - | No | Soft delete flag |

**Sample Data**:
- Amparo Directo
- Amparo Indirecto
- Revisión

**Row Count**: 3

---

### 6. **Cat_TipoCuaderno** (Notebook Types)
**Purpose**: Types of legal notebooks/files

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_tipoCuaderno | int | - | No | Primary Key |
| Nombre | varchar | 200 | No | Notebook type name |
| Eliminado | bit | - | No | Soft delete flag |

**Sample Data**:
- Principal
- Incidental
- Administrativo

**Row Count**: 3

---

### 7. **Cat_ClasificacionArchivo** (File Classifications)
**Purpose**: Document classification types

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_clasificacionArchivo | int | - | No | Primary Key |
| Nombre | varchar | 200 | No | Classification name |
| Eliminado | bit | - | No | Soft delete flag |

**Sample Data**:
- Acuerdo
- Sentencia
- Auto
- Promoción
- Anexo

**Row Count**: 5

---

### 8. **Expediente** (Case Files)
**Purpose**: Amparo case/file records

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_expediente | int | - | No | Primary Key (auto-increment) |
| ExpedienteCJF | varchar | 50 | No | CJF assigned case number |
| tipoProcedimiento | int | - | Yes | Procedure type |
| tipoSubNivel | int | - | Yes | Sub-level type |
| tipoMateria | int | - | No | Matter type |
| idOrganoOrigen | int | - | No | Origin organ ID |
| neun | bigint | - | No | NEUN (unique identifier) |
| expedienteElectronico | bit | - | No | Electronic file flag |
| urlEE | varchar | max | Yes | Electronic file URL |

**Row Count**: 0

---

### 9. **PartesExpediente** (Case Parties)
**Purpose**: Parties/participants in Amparo cases

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_parte | bigint | - | No | Primary Key (auto-increment) |
| NombreCompleto | varchar | 200 | No | Full name of party |
| Caracter | varchar | 200 | No | Party character/role |
| TipoPersona | varchar | 200 | No | Person type |
| PersonaId | varchar | 20 | No | Person ID |
| id_expediente | int | - | No | FK to Expediente |
| Nombre | varchar | 200 | Yes | First name |
| APaterno | varchar | 200 | Yes | Paternal last name |
| AMaterno | varchar | 200 | Yes | Maternal last name |
| IdCaracter | int | - | Yes | Character ID |
| IdTipoPersona | int | - | Yes | Person type ID |

**Relationships**:
- → Expediente (via id_expediente)

**Row Count**: 0

---

### 10. **Notificacion** (Notifications)
**Purpose**: Legal notifications/agreements sent

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_notificacion | int | - | No | Primary Key (auto-increment) |
| fecha_envio | datetime | - | No | Send date |
| organo_impartidor_justicia | int | - | No | FK to Cat_Juzgados |
| folioEnvio | bigint | - | No | Sending folio number |
| tipoCuaderno | varchar | max | Yes | Notebook type description |
| id_expediente | int | - | No | FK to Expediente |
| id_tipoAsunto | int | - | No | FK to Cat_TipoAsunto |

**Relationships**:
- → Cat_Juzgados (via organo_impartidor_justicia)
- → Cat_TipoAsunto (via id_tipoAsunto)
- → Expediente (via id_expediente)

**Row Count**: 0

---

### 11. **DocumentosNotificacion** (Notification Documents)
**Purpose**: Documents attached to notifications

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| Id_documento_notificacion | bigint | - | No | Primary Key (auto-increment) |
| IdDocumento | bigint | - | No | Document ID within notification |
| Nombre | varchar | 100 | No | Document name |
| Extension | varchar | 10 | No | File extension |
| Longitud | bigint | - | No | File size |
| Firmado | bit | - | No | Digitally signed flag |
| FechaFirmado | datetime | - | No | Signature date |
| HashDocumentoOriginal | varchar | max | Yes | Original document hash |
| id_notificacion | int | - | No | FK to Notificacion |
| id_clasificacionArchivo | int | - | No | FK to Cat_ClasificacionArchivo |
| ruta | varchar | max | Yes | File path |
| FileBase64 | varchar | max | Yes | Base64 encoded file |
| Pkcs7Base64 | varchar | max | Yes | PKCS7 signature |

**Relationships**:
- → Notificacion (via id_notificacion)
- → Cat_ClasificacionArchivo (via id_clasificacionArchivo)

**Row Count**: 0

---

### 12. **AmparosPJ** (Amparo Cases from Judiciary)
**Purpose**: Amparo cases received from judicial organs

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| IdAmparoPJ | int | - | No | Primary Key (auto-increment) |
| id_expediente | int | - | No | FK to Expediente |
| id_notificacion | int | - | No | FK to Notificacion |
| numeroExpedienteOIJ | varchar | 50 | No | OIJ case number |
| expedienteElectronico | bit | - | No | Electronic file flag |
| urlEE | varchar | max | Yes | Electronic file URL |

**Relationships**:
- → Expediente (via id_expediente)
- → Notificacion (via id_notificacion)

**Row Count**: 0

---

### 13. **Promocion** (Legal Promotions)
**Purpose**: Legal submissions/promotions

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_promocion | int | - | No | Primary Key (auto-increment) |
| fecha_envio | datetime | - | No | Send date |
| IdAmparoPJ | int | - | No | FK to AmparosPJ |
| tipoCuaderno | varchar | max | Yes | Notebook type |

**Relationships**:
- → AmparosPJ (via IdAmparoPJ)

**Row Count**: 0

---

### 14. **DocumentosPromocion** (Promotion Documents)
**Purpose**: Documents attached to promotions

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| Id_documento_promocion | bigint | - | No | Primary Key (auto-increment) |
| Nombre | varchar | 100 | No | Document name |
| Extension | varchar | 10 | No | File extension |
| Longitud | bigint | - | No | File size |
| Firmado | bit | - | No | Digitally signed flag |
| FechaFirmado | datetime | - | No | Signature date |
| HashDocumentoOriginal | varchar | max | Yes | Original document hash |
| id_promocion | int | - | No | FK to Promocion |
| id_clasificacionArchivo | int | - | No | FK to Cat_ClasificacionArchivo |
| ruta | varchar | max | Yes | File path |
| FileBase64 | varchar | max | Yes | Base64 encoded file |
| Pkcs7Base64 | varchar | max | Yes | PKCS7 signature |

**Row Count**: 0

---

### 15. **DetalleActosReclamados** (Claimed Acts Details)
**Purpose**: Details of acts being challenged in Amparo

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_acto_reclamadosxParte | int | - | No | Primary Key (auto-increment) |
| DescripOpcionActoRec | varchar | max | No | Act description/text |
| IdOpcionActoRec | int | - | No | Act option ID (0 for free text) |
| TipoCampo | int | - | No | Field type: 1=Option, 2=Free text |
| DescripcionIdCampo | varchar | max | No | Field ID and description |
| id_parte | bigint | - | No | FK to PartesExpediente |

**Relationships**:
- → PartesExpediente (via id_parte)

**Row Count**: 0

---

### 16. **ICOIJ_Solicitud** (Inter-institutional Requests)
**Purpose**: Requests from interconnected institutions

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| id_icoij_solicitud | int | - | No | Primary Key (auto-increment) |
| SolicitudId | bigint | - | No | Request/response folio |
| fecha_envio | datetime | - | No | Reception date |
| id_notificacion | int | - | No | FK to Notificacion |

**Relationships**:
- → Notificacion (via id_notificacion)

**Row Count**: 0

---

### 17. **ICOIJ_FIRMA_CAT_AC** (Digital Signature Authorities)
**Purpose**: Catalog of trusted certificate authorities for digital signatures

| Column | Type | Size | Nullable | Description |
|--------|------|------|----------|-------------|
| kIdAc | int | - | No | Primary Key |
| sNombreAc | varchar | 256 | No | CA name |
| sUrlServicioOcsp | varchar | 256 | No | OCSP service URL |
| sCertificadoAc | varchar | max | No | CA certificate |
| sResponsable | varchar | 256 | Yes | Responsible person |
| fFechaAlta | datetime | - | No | Creation date |
| fFechaModificacion | datetime | - | Yes | Modification date |
| fFechaBaja | datetime | - | Yes | Deactivation date |
| bEstatus | bit | - | No | Status flag |

**Row Count**: 0

---

## 🔗 Database Relationships

### Entity Relationship Diagram (ERD)

```
Usuarios
├─→ Cat_Perfil (id_perfil)
└─→ Cat_Juzgados (organo_impartidor_justicia)

Cat_Juzgados
└─→ Cat_Distritos (IdDistrito)

Expediente
└─← PartesExpediente (id_expediente)
└─← Notificacion (id_expediente)

PartesExpediente
└─← DetalleActosReclamados (id_parte)

Notificacion
├─→ Cat_Juzgados (organo_impartidor_justicia)
├─→ Cat_TipoAsunto (id_tipoAsunto)
├─→ Expediente (id_expediente)
└─← DocumentosNotificacion (id_notificacion)
└─← ICOIJ_Solicitud (id_notificacion)
└─← AmparosPJ (id_notificacion)

AmparosPJ
├─→ Expediente (id_expediente)
├─→ Notificacion (id_notificacion)
└─← Promocion (IdAmparoPJ)

Promocion
└─← DocumentosPromocion (id_promocion)

DocumentosNotificacion
└─→ Cat_ClasificacionArchivo (id_clasificacionArchivo)
```

---

## ⚙️ Stored Procedures

### 1. **pcConsultaAC**
**Purpose**: Get information from trusted Certificate Authorities  
**Parameters**: @pi_sNombreAc (AC name)

### 2. **stp_Existe_Organo_impartidor_justicia**
**Purpose**: Check if a judicial organ exists  
**Parameters**: @organo_impartidor_justicia  
**Returns**: 1 if exists, 0 if not

### 3. **stp_ExisteNotificacion**
**Purpose**: Check if a notification exists  
**Parameters**: @folioEnvio, @neun  
**Returns**: 1 if exists, 0 if not

### 4. **stp_ExtExpediente_Agregar**
**Purpose**: Add or retrieve existing Expediente  
**Parameters**: ExpedienteCJF, tipoProcedimiento, tipoSubNivel, tipoMateria, idOrganoOrigen, neun, expedienteElectronico, urlEE  
**Returns**: id_expediente

### 5. **stp_ExtPartesExpediente_Agregar**
**Purpose**: Add or retrieve existing case party  
**Parameters**: NombreCompleto, Caracter, TipoPersona, PersonaId, id_expediente, etc.  
**Returns**: id_parte

### 6. **stp_ExtDetalleActosReclamados_Agregar**
**Purpose**: Add or retrieve claimed act details  
**Parameters**: DescripOpcionActoRec, IdOpcionActoRec, TipoCampo, DescripcionIdCampo, id_parte  
**Returns**: id_acto_reclamadosxParte

### 7. **stp_ExtNotificacion_Agregar**
**Purpose**: Add notification record  
**Parameters**: fecha_envio, organo_impartidor_justicia, folioEnvio, tipoCuaderno, id_expediente, id_tipoAsunto  
**Returns**: id_notificacion

### 8. **stp_ExtDocumentosNotificacion_Agregar**
**Purpose**: Add or retrieve notification document  
**Parameters**: IdDocumento, Nombre, Extension, Longitud, Firmado, FechaFirmado, etc.  
**Returns**: Id_documento_notificacion

### 9. **stp_ExtICOIJ_Solicitud_Agregar**
**Purpose**: Add or retrieve ICOIJ request  
**Parameters**: SolicitudId, fecha_envio, id_notificacion  
**Returns**: id_icoij_solicitud

---

## 🎯 Key Design Patterns

### 1. **Soft Delete Pattern**
All main tables use `Eliminado` bit field:
- `0` = Active record
- `1` = Deleted record
- Records are never physically deleted

### 2. **Status Management**
- `Estado` field in Usuarios: 'A' (Active), 'I' (Inactive)
- `activo` bit in some catalog tables

### 3. **Electronic File Support**
Multiple tables support electronic files:
- `expedienteElectronico` bit flag
- `urlEE` for electronic file URLs
- `FileBase64` for embedded files
- `Pkcs7Base64` for digital signatures

### 4. **Idempotent Stored Procedures**
Most procedures check if record exists before inserting:
- Return existing ID if found
- Insert and return new ID if not found
- Ensures data integrity

---

## 📈 Database Statistics

| Metric | Count |
|--------|-------|
| **Total Tables** | 17 |
| **Total Columns** | 124 |
| **Catalog Tables** | 6 |
| **Business Tables** | 11 |
| **Stored Procedures** | 8 |
| **Foreign Keys** | ~13 |
| **Current Records** | 21 (catalogs only) |

---

## 🚀 Current Implementation Status

### ✅ Implemented in API:
- Usuarios (Full CRUD)
- Cat_Perfil (Full CRUD)
- Cat_Juzgados (Full CRUD)
- Cat_Distritos (Seeded only)
- Cat_TipoAsunto (Seeded only)
- Cat_TipoCuaderno (Seeded only)
- Cat_ClasificacionArchivo (Seeded only)

### ⏳ Not Yet Implemented:
- Expediente
- PartesExpediente
- Notificacion
- DocumentosNotificacion
- AmparosPJ
- Promocion
- DocumentosPromocion
- DetalleActosReclamados
- ICOIJ_Solicitud
- ICOIJ_FIRMA_CAT_AC

---

## 💡 Notes

1. **Primary Keys**: Most tables use IDENTITY (auto-increment) for PKs
2. **varchar(max)**: Size shown as `-1` indicates unlimited length
3. **Naming Convention**: Mixed (some Spanish, some abbreviations)
4. **Foreign Keys**: Proper referential integrity constraints
5. **Document Storage**: Supports both file paths and Base64 embedding

---

**Generated**: $(date)  
**Database**: PJF_Amparos  
**Server**: localhost:1433

