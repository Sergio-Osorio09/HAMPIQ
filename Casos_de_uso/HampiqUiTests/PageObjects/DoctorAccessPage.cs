using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Acceso del médico al historial mediante token (CU-04). Valida el token que
/// compartió el paciente y, si es válido, muestra el historial autorizado (solo lectura).
/// </summary>
public class DoctorAccessPage : BasePage
{
    public DoctorAccessPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public DoctorAccessPage IngresarToken(string code)
    {
        Type(Tid("doc-token"), code);
        Click(Tid("doc-submit"));
        return this;
    }

    public bool AccesoConcedido()
    {
        try { return WaitVisible(Tid("doc-granted")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    public string ObtenerBannerAcceso() => WaitVisible(Tid("doc-granted")).Text.Trim();

    public string ObtenerError() => WaitVisible(Tid("doc-error")).Text.Trim();
}
