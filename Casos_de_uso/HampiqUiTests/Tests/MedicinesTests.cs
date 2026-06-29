using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CP-09 · Buscar medicina + comparador de farmacias (función de soporte 5.3).
/// Verifica que al buscar un fármaco del catálogo se muestra el comparador de precios
/// por farmacia y se marca la más barata.
/// </summary>
[TestFixture]
public class MedicinesTests : TestBase
{
    [Test]
    [Description("CP-09 · Buscar «Paracetamol» muestra el comparador de farmacias con la más barata.")]
    public void BuscarMedicina_MuestraComparadorDeFarmacias()
    {
        using var ctx = new UiTestContext(Settings);

        var medicinas = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IniciarSesion("45872136", "hampiq123")
            .IrABuscarMedicina();

        medicinas.Buscar("Paracetamol").SeleccionarResultado("m3");

        var comparador = medicinas.ComparadorVisible();
        ctx.Capturar("CP-09-comparador-farmacias");

        comparador.Should().BeTrue("debe mostrarse el comparador de precios por farmacia");
        medicinas.MarcaMasBarato().Should().BeTrue("debe marcarse la farmacia más barata");
    }
}
