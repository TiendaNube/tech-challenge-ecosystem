import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';

export async function setupSwagger(app: INestApplication) {
    console.log(__dirname);
    const swaggerDocument = YAML.load('../../../docs/swagger.yaml');
    const document = SwaggerModule.createDocument(app, swaggerDocument);
    SwaggerModule.setup('api', app, document);
}
