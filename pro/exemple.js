export type CreerValeurAutoEvaluation = (
  utilisateur: Utilisateur,
  profilId: number,
  autoEvaluationId: number,
  competenceId: number,
  valeur: number
) => Promise<Either<Erreur, number>>;

const creerValeurAutoEvaluation = (
  findAutoEvaluation: FindAutoEvaluation = mysqlFindAutoEvaluation,
  creerValeurAutoEvaluationSQL: CreerValeurAutoEvaluationSQL = mysqlCreerValeurAutoEvaluation
): CreerValeurAutoEvaluation => (
  utilisateur: Utilisateur,
  profilId: number,
  autoEvaluationId: number,
  competenceId: number,
  valeur: number
): Promise<Either<Erreur, number>> => {

  const _verifieAppartenanceProfil = staticPromise(verifieAppartenanceProfil(utilisateur, profilId));
  const _verifieTypeProfil = verifieTypeProfil(isEntraineurOuJoueur)(utilisateur, profilId);
  const _verifieAutoEvaluation = verifieAutoEvaluation(findAutoEvaluation, autoEvaluationId, utilisateur, profilId);
  const _creeValeurSelonEtat = creeValeurSelonEtat(creerValeurAutoEvaluationSQL, autoEvaluationId, competenceId, valeur);

  return (
    _verifieAppartenanceProfil
      .then(_verifieTypeProfil)
      .then(_verifieAutoEvaluation)
      .then(_creeValeurSelonEtat)
  );
};

const verifieAutoEvaluation = (findAutoEvaluation: FindAutoEvaluation, autoEvaluationId: number, utilisateur: Utilisateur, profilId: number) => (maybeErreur: Maybe<Erreur>): Promise<Either<Erreur, string>> =>
  maybeErreur.cata({
    Nothing: () =>
      findAutoEvaluation.parId(autoEvaluationId)
        .then(
          maybeAutoEvaluation =>
            maybeAutoEvaluation.cata({
                Nothing: () => Either.Left(erreur('creerValeurAutoEvaluation', 'Auto-évaluation inexistante.')),
                Just: (autoEvaluation: DetailsAutoEvaluation) => verifieProfilUtilise(utilisateur, profilId, autoEvaluation.profilId, autoEvaluation.etat)
              }
            )
        ),
    Just: (erreur: Erreur) => Either.Left(erreur)
  });

  const verifieProfilUtilise = (utilisateur: Utilisateur, profilId: number, profilAutoEvaluationId: number, etatAutoEvaluation: string): Promise<Either<Erreur, string>> =>
    profilId === profilAutoEvaluationId ?
      Either.Right(etatAutoEvaluation) :
      verifieAppartenanceProfil(utilisateur, profilAutoEvaluationId) ?
        Either.Left(erreur('creerValeurAutoEvaluation', 'Auto-évaluation liée à un autre profil du même compte utilisateur.')) :
        Either.Left(erreur('creerValeurAutoEvaluation', "Cette auto-évaluation n'appartient pas à ce compte utilisateur"));

const creeValeurSelonEtat = (
  creerValeurAutoEvaluationSQL: CreerValeurAutoEvaluationSQL,
  autoEvaluationId: number,
  competenceId: number,
  valeur: number
) => (erreurOuEtatAutoEvaluation: Either<Erreur, string>): Promise<Either<Erreur, number>> =>
  erreurOuEtatAutoEvaluation.cata({
    Left: (erreur: Erreur) => Either.Left(erreur),
    Right: (etat: string) =>
      etat === 'terminee' ?
        creerValeurAutoEvaluationSQL.creerValeurAutoEvaluationTerminee(autoEvaluationId, competenceId, valeur) :
        creerValeurAutoEvaluationSQL.creerValeurAutoEvaluation(autoEvaluationId, competenceId, valeur)
  });

export default creerValeurAutoEvaluation;