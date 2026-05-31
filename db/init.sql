CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarjetas (
    id              SERIAL PRIMARY KEY,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    numero_hash     VARCHAR(64) NOT NULL,
    ultimos_digitos VARCHAR(4) NOT NULL,
    titular         VARCHAR(150) NOT NULL,
    expiracion      VARCHAR(7) NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pagos (
    id            SERIAL PRIMARY KEY,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tarjeta_id    INTEGER NOT NULL REFERENCES tarjetas(id) ON DELETE RESTRICT,
    monto         DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    estado        VARCHAR(15) NOT NULL DEFAULT 'pending',
    mensaje       VARCHAR(255),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarjetas_usuario ON tarjetas(usuario_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tarjetas_hash_usuario ON tarjetas(numero_hash, usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagos_usuario ON pagos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);
