import { Any, getManager } from 'typeorm';

export const getData = async (tableName: string): Promise<any[]> => {
  try {
    const entityManager = getManager();
    const result = await entityManager.query(`SELECT * FROM ${tableName} WHERE status_active = 1 `);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getData1 = async (startDate: string, endDate: string): Promise<any[]> => {
  try {
    const entityManager = getManager();

    // Calculate days difference and adelanto multiplier
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    const adelantoMultiplier = Math.ceil(diffDays / 15);

    const result = await entityManager.query(
      `
      SELECT 
        u.*, 
        s.monto AS salario_monto,
        g.descripcion AS grupo_descripcion,
        u.bono_familiar,
        u.adelanto,

        -- Overtime work price calculation (unchanged)
        COALESCE(SUM(
          CASE 
            WHEN m.aprobación_horas_extras = 1 
            THEN 
              GREATEST(
                0, 
                (
                  TIMESTAMPDIFF(MINUTE, m.entrada, m.salida_almuerzo) +
                  TIMESTAMPDIFF(MINUTE, m.entrada_almuerzo, m.salida) - 
                  (8 * 60)
                ) / 60.0
              ) * p.monto
            ELSE 0
          END
        ), 0) AS overtime_work_price,

        -- Production bonus from user table, only if created_at in range
        COALESCE(MAX(
          CASE 
            WHEN u.production_bonus_created_at BETWEEN ? AND ? 
            THEN u.production_bonus 
            ELSE 0 
          END
        ), 0) AS bono_produccion,

        -- Total worked minutes (unchanged)
        COALESCE(SUM(
          TIMESTAMPDIFF(MINUTE, m.entrada, m.salida_almuerzo) +
          TIMESTAMPDIFF(MINUTE, m.entrada_almuerzo, m.salida)
        ), 0) AS horas,

        -- Updated night work price: sum of adicional_nocturno
        COALESCE(SUM(m.adicional_nocturno), 0) AS nocturno,

        -- Total descuento amount per user (unchanged)
        COALESCE(SUM(d.monto), 0) AS total_descuento

      FROM user u
      LEFT JOIN salarios s ON u.id_salario = s.id
      LEFT JOIN grupos g ON u.id_grupo = g.id
      LEFT JOIN marcacion m ON m.id_usuario = u.id AND DATE(m.entrada) BETWEEN ? AND ?
      LEFT JOIN pagos p ON m.id_horas_extras = p.id
      LEFT JOIN descuento d ON m.id_descuento = d.id
      WHERE u.status_active = 1
      GROUP BY u.id, s.monto, g.descripcion, u.bono_familiar, u.adelanto
      `,
      [startDate, endDate, startDate, endDate]
    );

    return result.map((row: any) => {
      const workedMinutes = parseInt(row.horas, 10) || 0;

      // Calculate total income
      const totalIncome = 
        Number(row.salario_monto || 0) +
        Number(row.nocturno || 0) +  // now from adicional_nocturno sum
        Number(row.overtime_work_price || 0) +
        Number(row.bono_familiar || 0) +
        Number(row.bono_produccion || 0);

      // Calculate IPS
      const ips = totalIncome * 0.09;

      // Calculate adelanto deduction based on date range multiplier
      const adelantoDeduction = (Number(row.adelanto) || 0) * adelantoMultiplier;

      // Total pay calculation
      const totalPay = totalIncome - ips - adelantoDeduction - Number(row.total_descuento || 0);

      return {
        ...row,
        horas: workedMinutes,
        overtime_work_price: Number(row.overtime_work_price) || 0,
        bono_produccion: Number(row.bono_produccion) || 0,
        bono_familiar: Number(row.bono_familiar) || 0,
        adelanto_deduction: adelantoDeduction,
        ips,
        total_descuento: Number(row.total_descuento) || 0,
        total_pay: totalPay,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const get_overtimeData = async (startDate: string, endDate: string): Promise<any[]> => {
  try {
    const entityManager = getManager();
    const result = await entityManager.query(
      `
      SELECT 
        m.id AS id_marcacion,               -- Unique row ID for marcacion
        u.id AS id_usuario,
        u.id_empleado AS empleado,
        CONCAT(u.firstname, ' ', u.lastname) AS nombre,
        u.id_grupo AS grupo,
        TIMESTAMPDIFF(MINUTE, m.entrada, m.salida)
          - IF(
              m.salida_almuerzo IS NOT NULL AND m.entrada_almuerzo IS NOT NULL,
              TIMESTAMPDIFF(MINUTE, m.salida_almuerzo, m.entrada_almuerzo),
              0
            ) AS horas,
        m.entrada AS prohibido,
        m.salida AS salida,
        DATE(m.entrada) AS fecha,
        m.aprobación_horas_extras,          -- Approval status (tinyint)
        m.id_horas_extras,                  -- Overtime type ID
        p.descripcion AS descripcion_horas_extras,  -- Overtime type description from pagos table
        p.monto AS precio_horas_extras      -- Hourly price from pagos table
      FROM marcacion m
      JOIN user u ON m.id_usuario = u.id
      LEFT JOIN pagos p ON m.id_horas_extras = p.id
      WHERE 
        DATE(m.entrada) BETWEEN ? AND ?
        AND (
          TIMESTAMPDIFF(MINUTE, m.entrada, m.salida)
          - IF(
              m.salida_almuerzo IS NOT NULL AND m.entrada_almuerzo IS NOT NULL,
              TIMESTAMPDIFF(MINUTE, m.salida_almuerzo, m.entrada_almuerzo),
              0
            )
        ) > 480
      ORDER BY fecha DESC, u.id;
      `,
      [startDate, endDate]
    );
    return result;
  } catch (error) {
    throw error;
  }
};