from media_management import DOS_AND_DONTS, PublicationPlan, Region, default_platform


def test_happy_path_full_circle_flow() -> None:
    platform = default_platform()

    asset = platform.create_asset(
        title="Spring promo",
        body="Book now and track campaign impact with consent.",
        language="en",
        tags=["promo", "spring"],
    )

    translation = platform.translate_asset(asset.id, "es")
    assert translation.localized_title.startswith("[es]")

    plan = PublicationPlan(
        asset_id=asset.id,
        target_channels=["instagram", "programmatic_display"],
        target_regions=[Region.US, Region.EU],
        auto_manage=True,
    )
    records = platform.publish(plan, language="es")
    assert len(records) == 4

    point = platform.ingest_analytics(
        publication_id=records[0].plan_id,
        impressions=10000,
        clicks=50,
        conversions=0,
        spend_usd=200.0,
    )
    assert point.ctr == 0.005

    suggestions = platform.suggest_optimizations(records[0].plan_id, auto_manage=True)
    assert suggestions
    assert suggestions[0].recommendation.startswith("[AUTO-APPLIED]")


def test_compliance_blocks_pii() -> None:
    platform = default_platform()
    asset = platform.create_asset(
        title="Reach john@example.com today",
        body="Call +1 555 111 2222 for private patient details",
        language="en",
    )

    result = platform.validate_asset(asset.id)
    assert not result.approved
    assert any("email" in reason.lower() for reason in result.blocked_reasons)


def test_dos_and_donts_available() -> None:
    assert DOS_AND_DONTS["dos"]
    assert DOS_AND_DONTS["donts"]
