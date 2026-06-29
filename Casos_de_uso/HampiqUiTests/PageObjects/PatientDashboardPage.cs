using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Panel del paciente tras iniciar sesión. Confirma que la autenticación tuvo éxito
/// y permite navegar al módulo "Compartir acceso" (generación de tokens, CU-03).
/// </summary>
public class PatientDashboardPage : BasePage
{
    public PatientDashboardPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public bool EstaCargado()
    {
        try { return WaitVisible(Tid("patient-dashboard")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    public string ObtenerNombreUsuario() => WaitVisible(Tid("sidebar-username")).Text.Trim();

    public SharePage IrACompartirAcceso()
    {
        Click(Tid("nav-share"));
        return new SharePage(Driver, WaitSeconds);
    }
}
