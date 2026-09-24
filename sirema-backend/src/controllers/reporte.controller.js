import * as service from '../services/reporte.service.js';

export async function consolidadoBicuCnu(req, res, next) {
  try {
    const { anioId, semestreId } = req.query;
    res.json(await service.consolidadoBicuCnu(Number(anioId), Number(semestreId)));
  } catch (err) {
    next(err);
  }
}

export async function consolidadoPorCentro(req, res, next) {
  try {
    const { centroId, anioId, semestreId } = req.query;
    res.json(
      await service.consolidadoPorCentro(
        req.session.usuario.nombreUsuario,
        Number(centroId),
        Number(anioId),
        Number(semestreId)
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function consolidadoPorAreaConocimiento(req, res, next) {
  try {
    const { anioId, areaId } = req.query;
    res.json(await service.consolidadoPorAreaConocimiento(Number(anioId), Number(areaId)));
  } catch (err) {
    next(err);
  }
}

export async function consolidadoUnicam(req, res, next) {
  try {
    res.json(await service.consolidadoUnicam(Number(req.query.centroId)));
  } catch (err) {
    next(err);
  }
}

export async function multiplePorTipoIngreso(req, res, next) {
  try {
    const { centroId, tipoIngresoId, semestreId, anioLectivoId, tipo } = req.query;
    res.json(
      await service.multiplePorTipoIngreso(
        req.session.usuario.nombreUsuario,
        Number(centroId),
        Number(tipoIngresoId),
        Number(semestreId),
        Number(anioLectivoId),
        Number(tipo)
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function multiplePorTipoIngresoDetalle(req, res, next) {
  try {
    const { centroId, tipoIngresoId, semestreId, anioLectivoId } = req.query;
    res.json(
      await service.multiplePorTipoIngresoDetalle(
        Number(centroId),
        Number(tipoIngresoId),
        Number(semestreId),
        Number(anioLectivoId)
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function registroIndividual(req, res, next) {
  try {
    res.json(await service.registroIndividual(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function registroIndividualDetalle(req, res, next) {
  try {
    res.json(await service.registroIndividualDetalle(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function ultimaActualizacionPorCentro(req, res, next) {
  try {
    const { centroId, tipoIngresoId, semestreId, anioLectivoId } = req.query;
    res.json(
      await service.ultimaActualizacionPorCentro(
        req.session.usuario.nombreUsuario,
        Number(centroId),
        Number(tipoIngresoId),
        Number(semestreId),
        Number(anioLectivoId)
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function ultimaActualizacionPorCentroDetalle(req, res, next) {
  try {
    const { centroId, tipoIngresoId, semestreId, anioLectivoId } = req.query;
    res.json(
      await service.ultimaActualizacionPorCentroDetalle(
        req.session.usuario.nombreUsuario,
        Number(centroId),
        Number(tipoIngresoId),
        Number(semestreId),
        Number(anioLectivoId)
      )
    );
  } catch (err) {
    next(err);
  }
}
