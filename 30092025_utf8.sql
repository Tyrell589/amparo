USE [PJF_Amparos]
GO
/****** Object:  User [PJHIndirecto]    Script Date: 09/30/2025 12:15:28 ******/
CREATE USER [PJHIndirecto] FOR LOGIN [PJHIndirecto] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[ICOIJ_FIRMA_CAT_AC]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ICOIJ_FIRMA_CAT_AC](
	[kIdAc] [int] NOT NULL,
	[sNombreAc] [varchar](256) NOT NULL,
	[sUrlServicioOcsp] [varchar](256) NOT NULL,
	[sCertificadoAc] [varchar](max) NOT NULL,
	[sResponsable] [varchar](256) NULL,
	[fFechaAlta] [datetime] NOT NULL,
	[fFechaModificacion] [datetime] NULL,
	[fFechaBaja] [datetime] NULL,
	[bEstatus] [bit] NOT NULL,
 CONSTRAINT [PK_ICOIJ_FIRMA_CAT_AC] PRIMARY KEY CLUSTERED 
(
	[kIdAc] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Expediente]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Expediente](
	[id_expediente] [int] IDENTITY(1,1) NOT NULL,
	[ExpedienteCJF] [varchar](50) NOT NULL,
	[tipoProcedimiento] [int] NULL,
	[tipoSubNivel] [int] NULL,
	[tipoMateria] [int] NOT NULL,
	[idOrganoOrigen] [int] NOT NULL,
	[neun] [bigint] NOT NULL,
	[expedienteElectronico] [bit] NOT NULL,
	[urlEE] [varchar](max) NULL,
 CONSTRAINT [PK_Expediente] PRIMARY KEY CLUSTERED 
(
	[id_expediente] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Número de amparo asignado por el CJF' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Expediente', @level2type=N'COLUMN',@level2name=N'ExpedienteCJF'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Parametro que indica la existencia de EE' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Expediente', @level2type=N'COLUMN',@level2name=N'expedienteElectronico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Url de consumo de EE' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Expediente', @level2type=N'COLUMN',@level2name=N'urlEE'
GO
/****** Object:  Table [dbo].[Cat_Distritos]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Cat_Distritos](
	[IdDistrito] [int] NOT NULL,
	[Distrito] [varchar](10) NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[Tipo] [char](1) NULL,
	[Eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Cat_Distritos] PRIMARY KEY CLUSTERED 
(
	[IdDistrito] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Cat_ClasificacionArchivo]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Cat_ClasificacionArchivo](
	[id_clasificacionArchivo] [int] NOT NULL,
	[Nombre] [varchar](200) NOT NULL,
	[Eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Cat_ClasificacionArchivo] PRIMARY KEY CLUSTERED 
(
	[id_clasificacionArchivo] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Cat_TipoCuaderno]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Cat_TipoCuaderno](
	[id_tipoCuaderno] [int] NOT NULL,
	[Nombre] [varchar](200) NOT NULL,
	[Eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Cat_TipoCuaderno] PRIMARY KEY CLUSTERED 
(
	[id_tipoCuaderno] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Cat_TipoAsunto]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Cat_TipoAsunto](
	[id_tipoAsunto] [int] NOT NULL,
	[Nombre] [varchar](200) NOT NULL,
	[Eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Cat_TipoAsunto] PRIMARY KEY CLUSTERED 
(
	[id_tipoAsunto] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Cat_Perfil]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Cat_Perfil](
	[id_perfil] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](200) NOT NULL,
	[Eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Cat_Perfil] PRIMARY KEY CLUSTERED 
(
	[id_perfil] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Cat_Juzgados]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Cat_Juzgados](
	[IdJuzgadoPJHGO] [int] NOT NULL,
	[Clave] [varchar](4) NOT NULL,
	[Nombre] [varchar](200) NOT NULL,
	[TipoJuicio] [varchar](1) NOT NULL,
	[IdDistrito] [int] NOT NULL,
	[organo_impartidor_justicia] [int] NOT NULL,
	[Correo] [varchar](255) NULL,
	[Eliminado] [bit] NULL,
 CONSTRAINT [PK_Cat_Juzgados] PRIMARY KEY CLUSTERED 
(
	[organo_impartidor_justicia] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Id del juzgado en el catalogo del CJF' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Cat_Juzgados', @level2type=N'COLUMN',@level2name=N'organo_impartidor_justicia'
GO
/****** Object:  StoredProcedure [dbo].[pcConsultaAC]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Faustino Tapia
-- Description: Procedimiento para obtener la informacion de las ACs de confianza
-- EXEC	[dbo].[pcConsultaAC] @pi_sNombreAc = N'SERVICIO DE ADMINISTRACIÓN TRIBUTARIA'
-- =============================================
CREATE PROCEDURE [dbo].[pcConsultaAC]
	@pi_sNombreAc varchar(256) 
AS
BEGIN
	SET NOCOUNT ON;

			SELECT	sNombreAc,
					sUrlServicioOcsp, 
					sCertificadoAc,					
					isnull(sResponsable,'') as sResponsable
			FROM ICOIJ_FIRMA_CAT_AC WITH(NOLOCK)
			WHERE sNombreAc = @pi_sNombreAc 
			AND bEstatus = 1

	SET NOCOUNT OFF
	
END
GO
/****** Object:  Table [dbo].[PartesExpediente]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[PartesExpediente](
	[id_parte] [bigint] IDENTITY(1,1) NOT NULL,
	[NombreCompleto] [varchar](200) NOT NULL,
	[Caracter] [varchar](200) NOT NULL,
	[TipoPersona] [varchar](200) NOT NULL,
	[PersonaId] [varchar](20) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[Nombre] [varchar](200) NULL,
	[APaterno] [varchar](200) NULL,
	[AMaterno] [varchar](200) NULL,
	[IdCaracter] [int] NULL,
	[IdTipoPersona] [int] NULL,
 CONSTRAINT [PK_PartesExpediente] PRIMARY KEY CLUSTERED 
(
	[id_parte] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre de la parte' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'NombreCompleto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de carácter de la parte' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'Caracter'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre de la parte que registra los actos reclamados' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'Nombre'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Apellido Paterno de la parte que registra los actos reclamados' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'APaterno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Apellido Materno de la parte que registra los actos reclamados' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'AMaterno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del catalogo de carácter' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'IdCaracter'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del catalogo de tipo de persona' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente', @level2type=N'COLUMN',@level2name=N'IdTipoPersona'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Lista de Partes del expediente' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'PartesExpediente'
GO
/****** Object:  StoredProcedure [dbo].[stp_ExtExpediente_Agregar]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExtExpediente_Agregar]
    @ExpedienteCJF VARCHAR(50),
    @tipoProcedimiento INT,
    @tipoSubNivel INT = null,
    @tipoMateria INT = null,
    @idOrganoOrigen INT,
    @neun BIGINT,
    @expedienteElectronico BIT,
    @urlEE VARCHAR(MAX) = null
AS
declare 
	@IdAsignado int
	,@NumError int
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  

	IF EXISTS (SELECT * FROM Expediente WHERE neun =@neun AND  idOrganoOrigen = @idOrganoOrigen) 
BEGIN
   SELECT id_expediente FROM Expediente WHERE neun =@neun AND  idOrganoOrigen = @idOrganoOrigen ;
END
ELSE
BEGIN
			INSERT INTO [dbo].[Expediente]
           ([ExpedienteCJF]
           ,[tipoProcedimiento]
           ,[tipoSubNivel]
           ,[tipoMateria]
           ,[idOrganoOrigen]
           ,[neun]
           ,[expedienteElectronico]
           ,[urlEE]
           )
        VALUES
           (@ExpedienteCJF
           ,@tipoProcedimiento
           ,@tipoSubNivel
           ,@tipoMateria
           ,@idOrganoOrigen
           ,@neun
           ,@expedienteElectronico
           ,@urlEE
           );

select  @IdAsignado =  @@identity			
	
SELECT @IdAsignado;
		
END

END TRY  
BEGIN CATCH  
	select -1;	

END CATCH
	
		
			 				
END
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Usuarios](
	[IdUsuario] [int] IDENTITY(1,1) NOT NULL,
	[organo_impartidor_justicia] [int] NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[APaterno] [varchar](50) NOT NULL,
	[AMaterno] [varchar](50) NOT NULL,
	[Usuario] [varchar](20) NOT NULL,
	[Correo] [varchar](100) NOT NULL,
	[Clave] [varchar](20) NOT NULL,
	[Telefono] [varchar](10) NOT NULL,
	[Extensión] [varchar](5) NOT NULL,
	[Estado] [varchar](1) NOT NULL,
	[id_perfil] [int] NOT NULL,
	[Eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[IdUsuario] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  StoredProcedure [dbo].[stp_ExtPartesExpediente_Agregar]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExtPartesExpediente_Agregar]
    @NombreCompleto VARCHAR(200),
    @Caracter VARCHAR(200),
    @TipoPersona VARCHAR(200),
    @PersonaId VARCHAR(20),
    @id_expediente BIGINT,
    @Nombre VARCHAR(200) = null,
    @APaterno VARCHAR(200) = null,
    @AMaterno VARCHAR(200) = null,
    @IdCaracter INT = null,
    @IdTipoPersona INT = null
AS
declare 
	@IdAsignado int
	,@NumError int
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  

			IF EXISTS (SELECT * FROM PartesExpediente WHERE id_expediente =@id_expediente and PersonaId = @PersonaId) 
			BEGIN
				 SELECT id_parte FROM PartesExpediente WHERE id_expediente =@id_expediente 
				 and PersonaId = @PersonaId;
				 
			END
			ELSE
			BEGIN
				INSERT INTO [PJF_Amparos].[dbo].[PartesExpediente]
						([NombreCompleto]
						,[Caracter]
						,[TipoPersona]
						,[PersonaId]
						,[id_expediente]
						,[Nombre]
						,[APaterno]
						,[AMaterno]
						,[IdCaracter]
						,[IdTipoPersona])
						VALUES
						(@NombreCompleto,
						@Caracter,
						@TipoPersona,
						@PersonaId,
						@id_expediente,
						@Nombre,
						@APaterno,
						@AMaterno,
						@IdCaracter,
						@IdTipoPersona)
		
		select  @IdAsignado =  @@identity			
			
		SELECT @IdAsignado;
			
					
			END

 
END TRY  
BEGIN CATCH  
	select -1;	

END CATCH
	
		
			 				
END
GO
/****** Object:  StoredProcedure [dbo].[stp_Existe_Organo_impartidor_justicia]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_Existe_Organo_impartidor_justicia]
    @organo_impartidor_justicia BIGINT
		AS
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  

	IF EXISTS (SELECT * FROM Cat_Juzgados WHERE organo_impartidor_justicia = @organo_impartidor_justicia and Eliminado = 0) 
BEGIN
   SELECT 1;
END
ELSE
BEGIN
		select 0;	
END

END TRY  
BEGIN CATCH  
	select 0;	

END CATCH
	
		
			 				
END
GO
/****** Object:  Table [dbo].[Notificacion]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Notificacion](
	[id_notificacion] [int] IDENTITY(1,1) NOT NULL,
	[fecha_envio] [datetime] NOT NULL,
	[organo_impartidor_justicia] [int] NOT NULL,
	[folioEnvio] [bigint] NOT NULL,
	[tipoCuaderno] [varchar](max) NULL,
	[id_expediente] [int] NOT NULL,
	[id_tipoAsunto] [int] NOT NULL,
 CONSTRAINT [PK_Notificacion] PRIMARY KEY CLUSTERED 
(
	[id_notificacion] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de envio del acuerdo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Notificacion', @level2type=N'COLUMN',@level2name=N'fecha_envio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del organo al que se envia el acuerdo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Notificacion', @level2type=N'COLUMN',@level2name=N'organo_impartidor_justicia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del envio' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Notificacion', @level2type=N'COLUMN',@level2name=N'folioEnvio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descripción del tipo de cuaderno' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Notificacion', @level2type=N'COLUMN',@level2name=N'tipoCuaderno'
GO
/****** Object:  Table [dbo].[DetalleActosReclamados]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[DetalleActosReclamados](
	[id_acto_reclamadosxParte] [int] IDENTITY(1,1) NOT NULL,
	[DescripOpcionActoRec] [varchar](max) NOT NULL,
	[IdOpcionActoRec] [int] NOT NULL,
	[TipoCampo] [int] NOT NULL,
	[DescripcionIdCampo] [varchar](max) NOT NULL,
	[id_parte] [bigint] NOT NULL,
 CONSTRAINT [PK_DetalleActosReclamados] PRIMARY KEY CLUSTERED 
(
	[id_acto_reclamadosxParte] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Contiene la descripcion de la opcion o el texto del acto reclamado' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DetalleActosReclamados', @level2type=N'COLUMN',@level2name=N'DescripOpcionActoRec'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Id de la opcion del acto reclamado, para el caso de Texto Libre se le pone 0 por defaut' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DetalleActosReclamados', @level2type=N'COLUMN',@level2name=N'IdOpcionActoRec'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador de tipo de campo 1.-Opcion 2.-Texto Libre' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DetalleActosReclamados', @level2type=N'COLUMN',@level2name=N'TipoCampo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Contiene los valores Id y descripcion del campo (Acto reclamado)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DetalleActosReclamados', @level2type=N'COLUMN',@level2name=N'DescripcionIdCampo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Lista de Actos reclamados por Parte' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DetalleActosReclamados'
GO
/****** Object:  Table [dbo].[DocumentosNotificacion]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[DocumentosNotificacion](
	[Id_documento_notificacion] [bigint] IDENTITY(1,1) NOT NULL,
	[IdDocumento] [bigint] NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[Extension] [varchar](10) NOT NULL,
	[Longitud] [bigint] NOT NULL,
	[Firmado] [bit] NOT NULL,
	[FechaFirmado] [datetime] NOT NULL,
	[HashDocumentoOriginal] [varchar](max) NULL,
	[id_notificacion] [int] NOT NULL,
	[id_clasificacionArchivo] [int] NOT NULL,
	[ruta] [varchar](max) NULL,
	[FileBase64] [varchar](max) NULL,
	[Pkcs7Base64] [varchar](max) NULL,
 CONSTRAINT [PK_DocumentosNotificacion] PRIMARY KEY CLUSTERED 
(
	[Id_documento_notificacion] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del documento (dentro del envio)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosNotificacion', @level2type=N'COLUMN',@level2name=N'IdDocumento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'nombre del documento' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosNotificacion', @level2type=N'COLUMN',@level2name=N'Nombre'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Extension del documento' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosNotificacion', @level2type=N'COLUMN',@level2name=N'Extension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tamaño del documento' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosNotificacion', @level2type=N'COLUMN',@level2name=N'Longitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicador para saber si el documento esta firmado' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosNotificacion', @level2type=N'COLUMN',@level2name=N'Firmado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de firmado' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosNotificacion', @level2type=N'COLUMN',@level2name=N'FechaFirmado'
GO
/****** Object:  Table [dbo].[AmparosPJ]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[AmparosPJ](
	[IdAmparoPJ] [int] IDENTITY(1,1) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[id_notificacion] [int] NOT NULL,
	[numeroExpedienteOIJ] [varchar](50) NOT NULL,
	[expedienteElectronico] [bit] NOT NULL,
	[urlEE] [varchar](max) NULL,
 CONSTRAINT [PK_AmparosPJ] PRIMARY KEY CLUSTERED 
(
	[IdAmparoPJ] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Parametro que indica la existencia de EE' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AmparosPJ', @level2type=N'COLUMN',@level2name=N'expedienteElectronico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Url de consumo de EE' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AmparosPJ', @level2type=N'COLUMN',@level2name=N'urlEE'
GO
/****** Object:  Table [dbo].[ICOIJ_Solicitud]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ICOIJ_Solicitud](
	[id_icoij_solicitud] [int] IDENTITY(1,1) NOT NULL,
	[SolicitudId] [bigint] NOT NULL,
	[fecha_envio] [datetime] NOT NULL,
	[id_notificacion] [int] NOT NULL,
 CONSTRAINT [PK_ICOIJ_Solicitud] PRIMARY KEY CLUSTERED 
(
	[id_icoij_solicitud] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ICOIJ_Solicitud', @level2type=N'COLUMN',@level2name=N'id_icoij_solicitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Folio de respuesta a una solicitud' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ICOIJ_Solicitud', @level2type=N'COLUMN',@level2name=N'SolicitudId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de recepción de la solicitud' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ICOIJ_Solicitud', @level2type=N'COLUMN',@level2name=N'fecha_envio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Relacion con la tabla notificacion' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ICOIJ_Solicitud', @level2type=N'COLUMN',@level2name=N'id_notificacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Relación con una solicitud de la  institucion interconectada (puede ir vacia)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ICOIJ_Solicitud'
GO
/****** Object:  StoredProcedure [dbo].[stp_ExtDetalleActosReclamados_Agregar]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExtDetalleActosReclamados_Agregar]
    @DescripOpcionActoRec VARCHAR(MAX),
    @IdOpcionActoRec INT,
    @TipoCampo INT,
    @DescripcionIdCampo VARCHAR(MAX),
    @id_parte BIGINT
AS
declare 
	@IdAsignado int
	,@NumError int
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  

	IF EXISTS (SELECT * FROM DetalleActosReclamados WHERE id_parte = @id_parte and DescripOpcionActoRec = @DescripOpcionActoRec and TipoCampo = @TipoCampo) 
BEGIN
   SELECT id_acto_reclamadosxParte FROM DetalleActosReclamados WHERE id_parte = @id_parte and DescripOpcionActoRec = @DescripOpcionActoRec and TipoCampo = @TipoCampo;
END
ELSE
BEGIN
    INSERT INTO [dbo].[DetalleActosReclamados]
           ([DescripOpcionActoRec]
           ,[IdOpcionActoRec]
           ,[TipoCampo]
           ,[DescripcionIdCampo]
           ,[id_parte])
        VALUES
           (@DescripOpcionActoRec
           ,@IdOpcionActoRec
           ,@TipoCampo
           ,@DescripcionIdCampo
           ,@id_parte);


			select  @IdAsignado =  @@identity			
				
			SELECT @IdAsignado;
END

END TRY  
BEGIN CATCH  
	select -1;	

END CATCH
	
		
			 				
END
GO
/****** Object:  StoredProcedure [dbo].[stp_ExtNotificacion_Agregar]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExtNotificacion_Agregar]
      @fecha_envio							datetime
		 ,@organo_impartidor_justicia			int
     ,@folioEnvio										bigint
     ,@tipoCuaderno							varchar(max) = null
		 ,@id_expediente						bigint
		 ,@id_tipoAsunto int
AS
declare 
	@IdAsignado int
	,@NumError int
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  

INSERT INTO [PJF_Amparos].[dbo].[Notificacion]
           ([fecha_envio]
           ,[organo_impartidor_justicia]
           ,[folioEnvio]
           ,[tipoCuaderno]
           ,[id_expediente]
           ,[id_tipoAsunto])
     VALUES
           (@fecha_envio
           ,@organo_impartidor_justicia
           ,@folioEnvio
           ,@tipoCuaderno
           ,@id_expediente
           ,@id_tipoAsunto)	

select  @IdAsignado =  @@identity			
	SELECT @IdAsignado;

END TRY  
BEGIN CATCH  
	select -1;	

END CATCH
	
		
			 				
END
GO
/****** Object:  View [dbo].[Vta_NotificacionExpediente]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[Vta_NotificacionExpediente] AS SELECT
	Notificacion.id_notificacion, 
	Notificacion.organo_impartidor_justicia, 
	Notificacion.folioEnvio, 
	Expediente.ExpedienteCJF, 
	Expediente.neun
FROM
	dbo.Notificacion
	INNER JOIN
	dbo.Expediente
	ON 
		Notificacion.id_expediente = Expediente.id_expediente
GO
/****** Object:  StoredProcedure [dbo].[stp_ExtDocumentosNotificacion_Agregar]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExtDocumentosNotificacion_Agregar]
    @IdDocumento BIGINT,
    @Nombre VARCHAR(100),
    @Extension VARCHAR(10),
    @Longitud BIGINT,
    @Firmado BIT,
    @FechaFirmado DATETIME,
    @HashDocumentoOriginal VARCHAR(MAX) = null,
    @id_notificacion INT,
    @id_clasificacionArchivo INT,
    @ruta VARCHAR(MAX) = null,
		@FileBase64 VARCHAR(MAX),
		@Pkcs7Base64 VARCHAR(MAX) = null
AS
declare 
	@IdAsignado int
	,@NumError int
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  
		
		IF EXISTS (SELECT * FROM DocumentosNotificacion WHERE IdDocumento = @IdDocumento and id_notificacion = @id_notificacion) 
			BEGIN
				 SELECT Id_documento_notificacion FROM DocumentosNotificacion WHERE IdDocumento = @IdDocumento and id_notificacion = @id_notificacion;
			END
			ELSE
			BEGIN
					INSERT INTO [dbo].[DocumentosNotificacion]
           ([IdDocumento]
           ,[Nombre]
           ,[Extension]
           ,[Longitud]
           ,[Firmado]
           ,[FechaFirmado]
           ,[HashDocumentoOriginal]
           ,[id_notificacion]
           ,[id_clasificacionArchivo]
           ,[ruta]
					 ,[FileBase64]
					 ,[Pkcs7Base64])
        VALUES
           (@IdDocumento
           ,@Nombre
           ,@Extension
           ,@Longitud
           ,@Firmado
           ,@FechaFirmado
           ,@HashDocumentoOriginal
           ,@id_notificacion
           ,@id_clasificacionArchivo
           ,@ruta
					 ,@FileBase64
					 ,@Pkcs7Base64);




select  @IdAsignado =  @@identity			
	
SELECT @IdAsignado;
			END






END TRY  
BEGIN CATCH  
	select -1;	

END CATCH
	
		
			 				
END
GO
/****** Object:  StoredProcedure [dbo].[stp_ExtICOIJ_Solicitud_Agregar]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExtICOIJ_Solicitud_Agregar]
    @SolicitudId BIGINT,
    @fecha_envio DATETIME,
    @id_notificacion INT
AS
declare 
	@IdAsignado int
	,@NumError int
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  
		
		IF EXISTS (SELECT * FROM ICOIJ_Solicitud WHERE SolicitudId = @SolicitudId and id_notificacion = @id_notificacion) 
			BEGIN
				 SELECT id_icoij_solicitud FROM ICOIJ_Solicitud WHERE SolicitudId = @SolicitudId and id_notificacion = @id_notificacion;
			END
			ELSE
			BEGIN
					INSERT INTO [dbo].[ICOIJ_Solicitud]
           ([SolicitudId]
           ,[fecha_envio]
           ,[id_notificacion])
        VALUES
           (@SolicitudId
           ,@fecha_envio
           ,@id_notificacion);

select  @IdAsignado =  @@identity			
	
SELECT @IdAsignado;
			
			END

END TRY  
BEGIN CATCH  
	select -1;	

END CATCH
	
		
			 				
END
GO
/****** Object:  StoredProcedure [dbo].[stp_ExisteNotificacion]    Script Date: 09/30/2025 12:15:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[stp_ExisteNotificacion]
    @folioEnvio BIGINT,
    @neun BIGINT
AS
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRY  

	IF EXISTS (SELECT * FROM Vta_NotificacionExpediente WHERE folioEnvio = @folioEnvio and neun = @neun) 
BEGIN
   SELECT 1;
END
ELSE
BEGIN
		select 0;	
END

END TRY  
BEGIN CATCH  
	select 0;	

END CATCH
	
		
			 				
END
GO
/****** Object:  Table [dbo].[Promocion]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Promocion](
	[id_promocion] [int] IDENTITY(1,1) NOT NULL,
	[fecha_envio] [datetime] NOT NULL,
	[IdAmparoPJ] [int] NOT NULL,
	[tipoCuaderno] [varchar](max) NULL,
 CONSTRAINT [PK_Promocion] PRIMARY KEY CLUSTERED 
(
	[id_promocion] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descripción del tipo de cuaderno' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Promocion', @level2type=N'COLUMN',@level2name=N'tipoCuaderno'
GO
/****** Object:  Table [dbo].[DocumentosPromocion]    Script Date: 09/30/2025 12:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[DocumentosPromocion](
	[Id_documento_promocion] [bigint] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[Extension] [varchar](10) NOT NULL,
	[Longitud] [bigint] NOT NULL,
	[Firmado] [bit] NOT NULL,
	[FechaFirmado] [datetime] NOT NULL,
	[HashDocumentoOriginal] [varchar](max) NULL,
	[id_promocion] [int] NOT NULL,
	[id_clasificacionArchivo] [int] NOT NULL,
	[ruta] [varchar](max) NULL,
	[FileBase64] [varchar](max) NULL,
	[Pkcs7Base64] [varchar](max) NULL,
 CONSTRAINT [PK_DocumentosPromocion] PRIMARY KEY CLUSTERED 
(
	[Id_documento_promocion] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'nombre del documento' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosPromocion', @level2type=N'COLUMN',@level2name=N'Nombre'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Extension del documento' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosPromocion', @level2type=N'COLUMN',@level2name=N'Extension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tamaño del documento' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosPromocion', @level2type=N'COLUMN',@level2name=N'Longitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicador para saber si el documento esta firmado' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosPromocion', @level2type=N'COLUMN',@level2name=N'Firmado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de firmado' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DocumentosPromocion', @level2type=N'COLUMN',@level2name=N'FechaFirmado'
GO
/****** Object:  Default [DF__Cat_Clasi__Elimi__5535A963]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_ClasificacionArchivo] ADD  DEFAULT ((0)) FOR [Eliminado]
GO
/****** Object:  Default [DF_Cat_Distritos_Nombre]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_Distritos] ADD  CONSTRAINT [DF_Cat_Distritos_Nombre]  DEFAULT ('Nombre') FOR [Nombre]
GO
/****** Object:  Default [DF_Cat_Distritos_Activo]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_Distritos] ADD  CONSTRAINT [DF_Cat_Distritos_Activo]  DEFAULT ((0)) FOR [Eliminado]
GO
/****** Object:  Default [DF__Cat_Juzga__Elimi__5629CD9C]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_Juzgados] ADD  DEFAULT ((0)) FOR [Eliminado]
GO
/****** Object:  Default [DF__Cat_TipoA__Elimi__534D60F1]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_TipoAsunto] ADD  DEFAULT ((0)) FOR [Eliminado]
GO
/****** Object:  Default [DF__Cat_TipoC__Elimi__5441852A]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_TipoCuaderno] ADD  DEFAULT ((0)) FOR [Eliminado]
GO
/****** Object:  Default [DF_Usuarios_Estado]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Usuarios] ADD  CONSTRAINT [DF_Usuarios_Estado]  DEFAULT ('A') FOR [Estado]
GO
/****** Object:  ForeignKey [FK_AmparosPJ_Expediente]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[AmparosPJ]  WITH CHECK ADD  CONSTRAINT [FK_AmparosPJ_Expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[Expediente] ([id_expediente])
GO
ALTER TABLE [dbo].[AmparosPJ] CHECK CONSTRAINT [FK_AmparosPJ_Expediente]
GO
/****** Object:  ForeignKey [FK_AmparosPJ_Notificacion]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[AmparosPJ]  WITH CHECK ADD  CONSTRAINT [FK_AmparosPJ_Notificacion] FOREIGN KEY([id_notificacion])
REFERENCES [dbo].[Notificacion] ([id_notificacion])
GO
ALTER TABLE [dbo].[AmparosPJ] CHECK CONSTRAINT [FK_AmparosPJ_Notificacion]
GO
/****** Object:  ForeignKey [FK_Cat_Juzgados_Cat_Distritos]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Cat_Juzgados]  WITH CHECK ADD  CONSTRAINT [FK_Cat_Juzgados_Cat_Distritos] FOREIGN KEY([IdDistrito])
REFERENCES [dbo].[Cat_Distritos] ([IdDistrito])
GO
ALTER TABLE [dbo].[Cat_Juzgados] CHECK CONSTRAINT [FK_Cat_Juzgados_Cat_Distritos]
GO
/****** Object:  ForeignKey [FK_DetalleActosReclamados_PartesExpediente]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[DetalleActosReclamados]  WITH CHECK ADD  CONSTRAINT [FK_DetalleActosReclamados_PartesExpediente] FOREIGN KEY([id_parte])
REFERENCES [dbo].[PartesExpediente] ([id_parte])
GO
ALTER TABLE [dbo].[DetalleActosReclamados] CHECK CONSTRAINT [FK_DetalleActosReclamados_PartesExpediente]
GO
/****** Object:  ForeignKey [FK_DocumentosNotificacion_Cat_ClasificacionArchivo]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[DocumentosNotificacion]  WITH CHECK ADD  CONSTRAINT [FK_DocumentosNotificacion_Cat_ClasificacionArchivo] FOREIGN KEY([id_clasificacionArchivo])
REFERENCES [dbo].[Cat_ClasificacionArchivo] ([id_clasificacionArchivo])
GO
ALTER TABLE [dbo].[DocumentosNotificacion] CHECK CONSTRAINT [FK_DocumentosNotificacion_Cat_ClasificacionArchivo]
GO
/****** Object:  ForeignKey [FK_DocumentosNotificacion_Notificacion]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[DocumentosNotificacion]  WITH CHECK ADD  CONSTRAINT [FK_DocumentosNotificacion_Notificacion] FOREIGN KEY([id_notificacion])
REFERENCES [dbo].[Notificacion] ([id_notificacion])
GO
ALTER TABLE [dbo].[DocumentosNotificacion] CHECK CONSTRAINT [FK_DocumentosNotificacion_Notificacion]
GO
/****** Object:  ForeignKey [FK_DocumentosPromocion_Promocion]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[DocumentosPromocion]  WITH CHECK ADD  CONSTRAINT [FK_DocumentosPromocion_Promocion] FOREIGN KEY([id_promocion])
REFERENCES [dbo].[Promocion] ([id_promocion])
GO
ALTER TABLE [dbo].[DocumentosPromocion] CHECK CONSTRAINT [FK_DocumentosPromocion_Promocion]
GO
/****** Object:  ForeignKey [FK_ICOIJ_Solicitud_Notificacion]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[ICOIJ_Solicitud]  WITH CHECK ADD  CONSTRAINT [FK_ICOIJ_Solicitud_Notificacion] FOREIGN KEY([id_notificacion])
REFERENCES [dbo].[Notificacion] ([id_notificacion])
GO
ALTER TABLE [dbo].[ICOIJ_Solicitud] CHECK CONSTRAINT [FK_ICOIJ_Solicitud_Notificacion]
GO
/****** Object:  ForeignKey [FK_Notificacion_Cat_Juzgados]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Notificacion]  WITH CHECK ADD  CONSTRAINT [FK_Notificacion_Cat_Juzgados] FOREIGN KEY([organo_impartidor_justicia])
REFERENCES [dbo].[Cat_Juzgados] ([organo_impartidor_justicia])
GO
ALTER TABLE [dbo].[Notificacion] CHECK CONSTRAINT [FK_Notificacion_Cat_Juzgados]
GO
/****** Object:  ForeignKey [FK_Notificacion_Cat_TipoAsunto]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Notificacion]  WITH CHECK ADD  CONSTRAINT [FK_Notificacion_Cat_TipoAsunto] FOREIGN KEY([id_tipoAsunto])
REFERENCES [dbo].[Cat_TipoAsunto] ([id_tipoAsunto])
GO
ALTER TABLE [dbo].[Notificacion] CHECK CONSTRAINT [FK_Notificacion_Cat_TipoAsunto]
GO
/****** Object:  ForeignKey [FK_Notificacion_Expediente]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Notificacion]  WITH CHECK ADD  CONSTRAINT [FK_Notificacion_Expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[Expediente] ([id_expediente])
GO
ALTER TABLE [dbo].[Notificacion] CHECK CONSTRAINT [FK_Notificacion_Expediente]
GO
/****** Object:  ForeignKey [FK_PartesExpediente_Expediente]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[PartesExpediente]  WITH CHECK ADD  CONSTRAINT [FK_PartesExpediente_Expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[Expediente] ([id_expediente])
GO
ALTER TABLE [dbo].[PartesExpediente] CHECK CONSTRAINT [FK_PartesExpediente_Expediente]
GO
/****** Object:  ForeignKey [FK_Promocion_AmparosPJ]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Promocion]  WITH CHECK ADD  CONSTRAINT [FK_Promocion_AmparosPJ] FOREIGN KEY([IdAmparoPJ])
REFERENCES [dbo].[AmparosPJ] ([IdAmparoPJ])
GO
ALTER TABLE [dbo].[Promocion] CHECK CONSTRAINT [FK_Promocion_AmparosPJ]
GO
/****** Object:  ForeignKey [FK_Usuarios_Cat_Juzgados]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK_Usuarios_Cat_Juzgados] FOREIGN KEY([organo_impartidor_justicia])
REFERENCES [dbo].[Cat_Juzgados] ([organo_impartidor_justicia])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK_Usuarios_Cat_Juzgados]
GO
/****** Object:  ForeignKey [FK_Usuarios_Cat_Perfil]    Script Date: 09/30/2025 12:15:27 ******/
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK_Usuarios_Cat_Perfil] FOREIGN KEY([id_perfil])
REFERENCES [dbo].[Cat_Perfil] ([id_perfil])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK_Usuarios_Cat_Perfil]
GO
