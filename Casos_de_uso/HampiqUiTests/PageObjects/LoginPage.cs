using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Formulario de inicio de sesión (CU-02). Permite autenticarse con DNI + contraseña
/// y leer el mensaje de error cuando las credenciales son incorrectas.
/// </summary>
public class LoginPage : BasePage
{
    public LoginPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    /// <summary>Inicia sesión y devuelve el panel del paciente (flujo principal).</summary>
    public PatientDashboardPage IniciarSesion(string dni, string password)
    {
        CompletarCredenciales(dni, password);
        return new PatientDashboardPage(Driver, WaitSeconds);
    }

    /// <summary>Envía el formulario sin asumir éxito (para el flujo alterno de error).</summary>
    public LoginPage IntentarIniciarSesion(string dni, string password)
    {
        CompletarCredenciales(dni, password);
        return this;
    }

    public string ObtenerMensajeError() => WaitVisible(Tid("login-error")).Text.Trim();

    private void CompletarCredenciales(string dni, string password)
    {
        Type(Tid("login-dni"), dni);
        Type(Tid("login-password"), password);
        Click(Tid("login-submit"));
    }
}
