import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

const ModalEditarRegistro = ({ open, onClose, registro, onGuardar }) => {
  const validationSchema = yup.object({
    descripcion: yup.string().required("La descripción es obligatoria"),
    monto: yup
      .number()
      .required("El monto es obligatorio")
      .positive("El monto debe ser un número positivo"),
  });

  const formik = useFormik({
    initialValues: {
      descripcion: registro?.descripcion || "",
      monto: registro?.monto || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onGuardar(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Título con estilo */}
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
        <Typography variant="h6" component="div">
          Editar Registro
        </Typography>
      </DialogTitle>
      
      {/* Contenido del Modal */}
      <DialogContent sx={{ py: 3, px: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={formik.handleSubmit}>
          {/* Campo Descripción */}
          <Box mb={3}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
              variant="outlined"
            />
          </Box>
          
          {/* Campo Monto */}
          <Box mb={3}>
            <TextField
              fullWidth
              label="Monto"
              name="monto"
              type="number"
              value={formik.values.monto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.monto && Boolean(formik.errors.monto)}
              helperText={formik.touched.monto && formik.errors.monto}
              variant="outlined"
            />
          </Box>
        </form>
      </DialogContent>
      
      {/* Botones de Acción */}
      <DialogActions sx={{ px: 4, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: "bold",
            boxShadow: 3,
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditarRegistro;
