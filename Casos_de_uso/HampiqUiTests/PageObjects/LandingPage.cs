using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Página de inicio (landing) de HAMPIQ. Es el punto de entrada de los tres casos
/// de prueba: desde aquí se navega al inicio de sesión o al modo emergencia.
/// </summary>
public class LandingPage : BasePage
{
    public LandingPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public LoginPage IrAIniciarSesion()
    {
        Click(Tid("landing-login"));
        return new LoginPage(Driver, WaitSeconds);
    }

    public EmergencyPage IrAEmergencia()
    {
        Click(Tid("landing-emergency"));
        return new EmergencyPage(Driver, WaitSeconds);
    }

    public RegisterPage IrARegistro()
    {
        Click(Tid("landing-register"));
        return new RegisterPage(Driver, WaitSeconds);
    }
}
